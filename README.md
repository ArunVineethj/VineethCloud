# VineethCloud – Arun Vineeth J Portfolio

**Junior DevOps Engineer** · Pudukkottai, Tamil Nadu, India

---

## Project Structure

```
VineethCloud/
├── frontend/
│   ├── index.html      ← Full portfolio website (open in browser)
│   ├── style.css       ← Complete dark-theme stylesheet
│   └── script.js       ← All JS: particles, API calls, VIEW DETAILS modal
│
├── backend/
│   ├── app.py          ← Flask API (MySQL + Memcached + RabbitMQ client code)
│   ├── requirements.txt
│   └── .env.example    ← Copy to .env and fill in your credentials
│
├── db/
│   ├── schema.sql      ← Run once to create tables
│   └── seed.sql        ← Run once to insert profile data
│
└── README.md
```

---

## Important

**This project contains only client/application code.**

MySQL, Memcached and RabbitMQ are **NOT created, installed or started** by
this project. You must start them yourself before the backend can reach them.

---

## Data Flow

```
Browser
  │
  ├─ GET /api/profile ──► Flask backend
  │                           │
  │                    1. Check Memcached (key: "profile:arun")
  │                           │
  │                    ┌──────┴─────────────┐
  │                    │                    │
  │                  HIT                  MISS
  │                    │                    │
  │            Return cached          Query MySQL
  │            data (green            Store in Memcached
  │            banner)                Return data (blue banner)
  │
  ├─ POST /api/view-event ──► Flask publishes to RabbitMQ queue "profile_views"
  │
  └─ POST /api/contact ────► Flask saves to MySQL contact_messages table
```

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and set:

| Variable           | Default     | Description              |
|--------------------|-------------|--------------------------|
| `MYSQL_HOST`       | localhost   | MySQL server host        |
| `MYSQL_PORT`       | 3306        | MySQL server port        |
| `MYSQL_USER`       | vineeth_user| MySQL username           |
| `MYSQL_PASSWORD`   | –           | MySQL password           |
| `MYSQL_DB`         | vineeth_portfolio | Database name      |
| `MEMCACHED_HOST`   | localhost   | Memcached host           |
| `MEMCACHED_PORT`   | 11211       | Memcached port           |
| `RABBITMQ_HOST`    | localhost   | RabbitMQ host            |
| `RABBITMQ_PORT`    | 5672        | RabbitMQ AMQP port       |
| `RABBITMQ_USER`    | guest       | RabbitMQ username        |
| `RABBITMQ_PASSWORD`| guest       | RabbitMQ password        |
| `FLASK_PORT`       | 5000        | Flask listen port        |

---

## Running the Backend

```bash
# 1. Go to backend directory
cd backend

# 2. Copy and fill in .env
cp .env.example .env
# edit .env with your MySQL/Memcached/RabbitMQ credentials

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Start services FIRST (you do this separately):
#    MySQL    on port 3306
#    Memcached on port 11211
#    RabbitMQ  on port 5672

# 5. Load the database
mysql -u root -p < ../db/schema.sql
mysql -u vineeth_user -p vineeth_portfolio < ../db/seed.sql

# 6. Run the Flask backend
python app.py
```

---

## Opening the Frontend

```bash
# Just open the file in your browser:
open frontend/index.html          # macOS
start frontend/index.html         # Windows
xdg-open frontend/index.html      # Linux
```

The frontend loads immediately in any browser.

The **VIEW DETAILS** button calls the Flask API at `http://localhost:5000`.

If the backend is not running, the popup shows a red "UNAVAILABLE" banner
and an error message — it never shows fake or hardcoded data.

---

## API Endpoints

| Method | Path                   | Description                                      |
|--------|------------------------|--------------------------------------------------|
| GET    | `/api/profile`         | Returns profile with `source`: memcached / mysql / unavailable |
| POST   | `/api/view-event`      | Publishes click event to RabbitMQ                |
| GET    | `/api/health`          | Returns status of mysql, memcached, rabbitmq     |

---

## VIEW DETAILS – How the Banner Works

The `source` field in the API response controls the banner colour:

| `source` value | Banner colour | Meaning                              |
|----------------|--------------|--------------------------------------|
| `memcached`    | 🟢 Green     | Profile was in cache (cache HIT)     |
| `mysql`        | 🔵 Blue      | Cache miss – fetched from MySQL      |
| `unavailable`  | 🔴 Red       | Both MySQL and Memcached unreachable |

The banner is rendered by `renderSourceBanner()` in `script.js`.
Nothing is hardcoded – it always reflects the real API response.
