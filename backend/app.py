"""
VineethCloud Portfolio – Flask Backend
=======================================
Talks to MySQL, Memcached and RabbitMQ using connection details
from environment variables (or a .env file).

IMPORTANT: This file only contains CLIENT CODE.
  - It does NOT create, install, or start MySQL, Memcached, or RabbitMQ.
  - You must start those services yourself before running this backend.
"""

import os
import json
import logging
from datetime import datetime, timezone

import pymysql
import pika
from pymemcache.client.base import Client as MemcacheClient
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# ── Load .env if present ───────────────────────────────────────────────────
load_dotenv()

# ── Logging ────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
)
log = logging.getLogger("vineethcloud")

app = Flask(__name__)
CORS(app)   # allow the frontend (served from a different origin) to call us

# ── Environment variables ──────────────────────────────────────────────────
MYSQL_HOST     = os.getenv("MYSQL_HOST",     "localhost")
MYSQL_PORT     = int(os.getenv("MYSQL_PORT", "3306"))
MYSQL_USER     = os.getenv("MYSQL_USER",     "vineeth_user")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
MYSQL_DB       = os.getenv("MYSQL_DB",       "vineeth_portfolio")

MEMCACHED_HOST = os.getenv("MEMCACHED_HOST", "localhost")
MEMCACHED_PORT = int(os.getenv("MEMCACHED_PORT", "11211"))

RABBITMQ_HOST     = os.getenv("RABBITMQ_HOST",     "localhost")
RABBITMQ_PORT     = int(os.getenv("RABBITMQ_PORT", "5672"))
RABBITMQ_USER     = os.getenv("RABBITMQ_USER",     "guest")
RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD", "guest")

MEMCACHED_KEY = "profile:arun"
MEMCACHED_TTL = 300          # seconds
RABBITMQ_QUEUE = "profile_views"


# ══════════════════════════════════════════════════════════════════════════
#  CONNECTION HELPERS
#  Each function opens a fresh connection / client, uses it, then closes it.
#  This keeps the code simple and avoids stale connection issues.
# ══════════════════════════════════════════════════════════════════════════

def get_mysql_connection():
    """
    Open and return a PyMySQL connection to the MySQL server.
    Raises pymysql.Error (or OSError) if the server is not reachable.
    The caller is responsible for closing the connection.
    """
    return pymysql.connect(
        host=MYSQL_HOST,
        port=MYSQL_PORT,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DB,
        connect_timeout=5,          # do not hang for more than 5 s
        cursorclass=pymysql.cursors.DictCursor,
    )


def get_memcache_client():
    """
    Create and return a pymemcache Client pointing at the Memcached server.
    pymemcache is lazy – it does not actually connect until the first operation,
    so we do a quick 'get' to verify reachability.
    Raises OSError / socket errors if the server is unreachable.
    """
    client = MemcacheClient(
        (MEMCACHED_HOST, MEMCACHED_PORT),
        connect_timeout=3,
        timeout=3,
    )
    return client


def publish_to_rabbitmq(message: dict) -> bool:
    """
    Open a short-lived connection to RabbitMQ, declare the queue (idempotent),
    publish one persistent JSON message, then close the connection.

    Returns True on success, False if RabbitMQ is unreachable or publish fails.
    The caller should not crash on False – it means the event was not recorded.
    """
    try:
        credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASSWORD)
        parameters  = pika.ConnectionParameters(
            host=RABBITMQ_HOST,
            port=RABBITMQ_PORT,
            credentials=credentials,
            connection_attempts=1,
            socket_timeout=4,
        )
        connection = pika.BlockingConnection(parameters)
        channel    = connection.channel()

        # Declare the queue – safe to call even if it already exists
        channel.queue_declare(queue=RABBITMQ_QUEUE, durable=True)

        channel.basic_publish(
            exchange="",
            routing_key=RABBITMQ_QUEUE,
            body=json.dumps(message),
            properties=pika.BasicProperties(
                delivery_mode=pika.DeliveryMode.Persistent,
                content_type="application/json",
            ),
        )
        connection.close()
        log.info("RabbitMQ: published to '%s': %s", RABBITMQ_QUEUE, message)
        return True

    except Exception as exc:
        log.error("RabbitMQ: publish failed – %s", exc)
        return False


def fetch_profile_from_mysql() -> dict | None:
    """
    Query the 'profile' table in MySQL and return the first row as a dict.
    Returns None if the table is empty.
    Raises pymysql.Error if the connection fails.
    """
    conn = get_mysql_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM profile LIMIT 1")
            row = cur.fetchone()
        return row   # dict or None
    finally:
        conn.close()


# ══════════════════════════════════════════════════════════════════════════
#  API ROUTES
# ══════════════════════════════════════════════════════════════════════════

@app.route("/api/profile", methods=["GET"])
def api_profile():
    """
    GET /api/profile
    ────────────────
    1. Try Memcached first (key = MEMCACHED_KEY).
       → Hit  : return data with source = "memcached"
    2. Miss : query MySQL, store result in Memcached (TTL 300 s).
       → Miss : return data with source = "mysql"
    3. If both are unreachable: HTTP 503, source = "unavailable".
    """
    now = datetime.now(timezone.utc).isoformat()

    # ── Step 1: Memcached ──────────────────────────────────────────────────
    try:
        mc     = get_memcache_client()
        cached = mc.get(MEMCACHED_KEY)

        if cached:
            # Cache HIT – deserialise and return immediately
            profile_data = json.loads(cached)
            log.info("Memcached HIT for key '%s'", MEMCACHED_KEY)
            return jsonify({
                "source":       "memcached",
                "retrieved_at": now,
                "data":         profile_data,
            })

        # Cache MISS – fall through to MySQL
        log.info("Memcached MISS for key '%s'", MEMCACHED_KEY)

    except Exception as mc_err:
        # Memcached is down – log and fall through to MySQL
        log.warning("Memcached unreachable: %s", mc_err)
        mc = None

    # ── Step 2: MySQL ──────────────────────────────────────────────────────
    try:
        profile_data = fetch_profile_from_mysql()

        if profile_data is None:
            return jsonify({
                "source":       "mysql",
                "retrieved_at": now,
                "error":        "Profile row not found in database.",
                "data":         {},
            }), 404

        # Convert any non-serialisable types (e.g. Decimal) to str
        profile_data = {k: (str(v) if v is not None else None)
                        for k, v in profile_data.items()}

        # ── Step 3: Store in Memcached ─────────────────────────────────────
        if mc is not None:
            try:
                mc.set(MEMCACHED_KEY, json.dumps(profile_data), expire=MEMCACHED_TTL)
                log.info("Memcached SET key '%s' (TTL %ds)", MEMCACHED_KEY, MEMCACHED_TTL)
            except Exception as set_err:
                log.warning("Memcached SET failed: %s", set_err)

        log.info("MySQL: profile fetched successfully")
        return jsonify({
            "source":       "mysql",
            "retrieved_at": now,
            "data":         profile_data,
        })

    except Exception as db_err:
        log.error("MySQL unreachable: %s", db_err)
        # Both Memcached and MySQL failed
        return jsonify({
            "source":       "unavailable",
            "retrieved_at": now,
            "error":        f"Backend services not reachable: {db_err}",
            "data":         {},
        }), 503


@app.route("/api/view-event", methods=["POST"])
def api_view_event():
    """
    POST /api/view-event
    ────────────────────
    Publish a 'view_details_clicked' event to RabbitMQ queue 'profile_views'.
    If RabbitMQ is unreachable, log the error and return a JSON status –
    the app MUST NOT crash.
    """
    message = {
        "event": "view_details_clicked",
        "time":  datetime.now(timezone.utc).isoformat(),
    }
    sent = publish_to_rabbitmq(message)
    return jsonify({
        "published": sent,
        "message":   "Event queued." if sent else "RabbitMQ not reachable – event not sent.",
    })


@app.route("/api/health", methods=["GET"])
def api_health():
    """
    GET /api/health
    ───────────────
    Check each service independently and report its status.
    Returns 200 regardless – the caller reads the per-service fields.
    """
    health = {
        "mysql":     {"status": "unknown", "detail": ""},
        "memcached": {"status": "unknown", "detail": ""},
        "rabbitmq":  {"status": "unknown", "detail": ""},
    }

    # MySQL check
    try:
        conn = get_mysql_connection()
        conn.close()
        health["mysql"] = {"status": "ok", "detail": f"{MYSQL_HOST}:{MYSQL_PORT}"}
    except Exception as e:
        health["mysql"] = {"status": "down", "detail": str(e)}

    # Memcached check
    try:
        mc = get_memcache_client()
        mc.get("__health_check__")
        health["memcached"] = {"status": "ok", "detail": f"{MEMCACHED_HOST}:{MEMCACHED_PORT}"}
    except Exception as e:
        health["memcached"] = {"status": "down", "detail": str(e)}

    # RabbitMQ check
    try:
        credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASSWORD)
        params = pika.ConnectionParameters(
            host=RABBITMQ_HOST, port=RABBITMQ_PORT,
            credentials=credentials, socket_timeout=4, connection_attempts=1,
        )
        conn = pika.BlockingConnection(params)
        conn.close()
        health["rabbitmq"] = {"status": "ok", "detail": f"{RABBITMQ_HOST}:{RABBITMQ_PORT}"}
    except Exception as e:
        health["rabbitmq"] = {"status": "down", "detail": str(e)}

    return jsonify(health)


# ══════════════════════════════════════════════════════════════════════════
#  ENTRY POINT
# ══════════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    port  = int(os.getenv("FLASK_PORT",  "5000"))
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    log.info("Starting VineethCloud backend on port %d", port)
    app.run(host="0.0.0.0", port=port, debug=debug)
