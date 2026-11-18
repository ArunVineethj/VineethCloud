<<<<<<< HEAD
# Arun Vineeth J – Personal Portfolio Application

A full-stack personal portfolio for **Arun Vineeth J**, Junior DevOps Engineer, built with
React, Java Servlets on Apache Tomcat, Memcached, RabbitMQ, and MySQL.

---

## Table of Contents

1. [Application Architecture](#1-application-architecture)
2. [What Each Service Does](#2-what-each-service-does)
3. [How React Communicates With Tomcat](#3-how-react-communicates-with-tomcat)
4. [How Java Communicates With MySQL](#4-how-java-communicates-with-mysql)
5. [How Memcached Works](#5-how-memcached-works)
6. [How RabbitMQ Works](#6-how-rabbitmq-works)
7. [How Contact Messages Reach MySQL](#7-how-contact-messages-reach-mysql)
8. [Project Structure](#8-project-structure)
9. [Build the React Frontend](#9-build-the-react-frontend)
10. [Package the Maven WAR](#10-package-the-maven-war)
11. [Start Docker Compose](#11-start-docker-compose)
12. [Access the Portfolio](#12-access-the-portfolio)
13. [Test Profile Cache Hit and Miss](#13-test-profile-cache-hit-and-miss)
14. [Clear the Profile Cache](#14-clear-the-profile-cache)
15. [Inspect RabbitMQ Queues](#15-inspect-rabbitmq-queues)
16. [Verify Contact Messages in MySQL](#16-verify-contact-messages-in-mysql)

---

## 1. Application Architecture

```
Browser
   │
   ▼
Apache Tomcat 10.1 (port 8080)
   │
   ├── React Frontend  ── Static files served from WAR root
   │
   └── Java Servlet REST APIs (/api/*)
             │
             ├── Memcached (port 11211) ── Cache-aside pattern
             │
             ├── RabbitMQ  (port 5672)  ── Contact form queue
             │
             └── MySQL     (port 3306)  ── Persistent data store
```

**Communication rules**
- The browser talks **only** to Tomcat.
- React fetches data from Java Servlet REST APIs (`/api/*`).
- Java checks Memcached first; on miss, falls back to MySQL and populates the cache.
- Contact form submissions are published to RabbitMQ; a Java worker saves them to MySQL.
- React never touches MySQL, Memcached, or RabbitMQ directly.

---

## 2. What Each Service Does

| Service | Role |
|---|---|
| **React (Vite)** | Frontend UI. Built to static files and bundled into the Tomcat WAR. |
| **Apache Tomcat 10.1** | Application server. Serves the React frontend and hosts the Java Servlet REST APIs. |
| **Java Servlets** | Backend logic. Handles all REST API requests. Talks to Memcached, RabbitMQ, and MySQL. |
| **Memcached** | In-memory cache. Stores frequently accessed portfolio data (profile, skills, projects, etc.) with a 300-second TTL to reduce MySQL load. |
| **RabbitMQ** | Message broker. Receives contact form submissions from the Servlet and delivers them to the Java worker for processing. |
| **MySQL** | Relational database. Stores all portfolio data (profile, skills, projects, education, experience) and processed contact messages. |

---

## 3. How React Communicates With Tomcat

The Vite production build produces static files (`frontend/dist/`).  
The Maven WAR plugin copies these files into the WAR root.  
Tomcat serves them as static content via its `DefaultServlet`.

React makes `fetch()` calls to `/api/*` paths.  
Because both the HTML and the APIs are served from the same Tomcat instance on the same origin, there are no CORS issues in production.

**Example:**
```
Browser → GET http://localhost:8080/              → Tomcat serves index.html
Browser → GET http://localhost:8080/api/skills    → SkillsServlet returns JSON
Browser → POST http://localhost:8080/api/contact  → ContactServlet handles form
```

---

## 4. How Java Communicates With MySQL

Java uses **JDBC** (Java Database Connectivity) with the **MySQL Connector/J** driver.

The `DatabaseUtil` class opens a JDBC connection using environment variables:
- `DB_URL`      – e.g. `jdbc:mysql://mysql:3306/vineeth_portfolio`
- `DB_USER`     – MySQL username
- `DB_PASSWORD` – MySQL password

Each service class (ProfileService, SkillService, etc.) opens a connection,
runs a `PreparedStatement`, maps the `ResultSet` to a Java model object, and closes
the connection. Using `PreparedStatement` prevents SQL injection.

---

## 5. How Memcached Works

Memcached is an in-memory key-value store. The portfolio uses a **cache-aside** pattern:

```
1. Java Servlet receives a GET /api/profile request.
2. Java checks Memcached for key "profile:1".
3. CACHE HIT  → return cached data, set source = "MEMCACHED".
4. CACHE MISS → query MySQL, store result in Memcached with TTL=300s, set source = "MYSQL".
5. JSON response includes the "source" field.
6. React reads the "source" field and shows the coloured badge in the popup.
```

The `MemcachedUtil` class manages a single `MemcachedClient` (Spymemcached library).  
If Memcached is unavailable, the application falls back to MySQL gracefully.

**Cache TTL:** 300 seconds (5 minutes).  
**Cache keys used:**
- `profile:1`
- `skills:all`
- `projects:all`
- `education:all`
- `experience:all`

---

## 6. How RabbitMQ Works

RabbitMQ is a message broker. The portfolio uses it for the contact form:

```
React (browser)
  │  POST /api/contact (JSON body)
  ▼
ContactServlet (Java)
  │  validates the message
  ▼
RabbitMQ – portfolio_contact_queue (durable)
  │  message persisted in broker
  ▼
ContactWorker (Java daemon thread inside Tomcat)
  │  consumes message, deserialises JSON
  ▼
MySQL – contact_messages table
```

The queue is **durable** – messages survive a RabbitMQ restart.  
The worker uses **manual acknowledgement** – it only acks after a successful MySQL save.  
If MySQL fails, the message is nacked without requeue to avoid a poison-pill loop.

---

## 7. How Contact Messages Reach MySQL

1. Visitor fills in the contact form (Name, Email, Subject, Message).
2. React validates the form in the browser (empty field checks, email format).
3. React sends `POST /api/contact` with a JSON body.
4. `ContactServlet` performs backend validation again.
5. If valid, `ContactService.submit()` serialises the message to JSON and calls `RabbitMQUtil.publish()`.
6. `RabbitMQUtil` publishes the message to `portfolio_contact_queue`.
7. `ContactWorker` (running as a daemon thread in Tomcat) consumes the message.
8. `ContactService.saveToDatabase()` inserts the row into `contact_messages` using JDBC.
9. The visitor sees: *"Thank you! Your message has been received and is being processed."*

---

## 8. Project Structure

```
Project/
├── frontend/                   React Vite application
│   ├── src/
│   │   ├── components/         All React components and their CSS
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                    Maven WAR project
│   ├── src/main/java/com/arunvineeth/portfolio/
│   │   ├── model/              Java model classes (Profile, Skill, etc.)
│   │   ├── service/            Business logic + cache-aside pattern
│   │   ├── servlet/            Java Servlet REST endpoints
│   │   ├── util/               DatabaseUtil, MemcachedUtil, RabbitMQUtil, CorsUtil
│   │   └── worker/             ContactWorker (RabbitMQ consumer)
│   ├── src/main/webapp/WEB-INF/web.xml
│   ├── src/main/resources/logback.xml
│   └── pom.xml
│
├── database/
│   └── init.sql                MySQL schema + seed data
│
└── README.md
```

---

## 9. Build the React Frontend

```bash
# From Git Bash on Windows

cd frontend
npm install
npm run build
# Output: frontend/dist/
```

The `dist/` folder contains the production-ready static files that the Maven WAR plugin
copies into the WAR during the next step.

---

## 10. Package the Maven WAR

```bash
# From Git Bash on Windows
# Run AFTER building the React frontend (step 9)

cd backend
mvn clean package -DskipTests
# Output: backend/target/portfolio.war
```

The WAR file contains:
- React static files at the WAR root (served by Tomcat DefaultServlet)
- Java Servlet classes
- All dependency JARs (MySQL driver, Memcached client, RabbitMQ client, Jackson, Logback)

---

## 11. Start Docker Compose

```bash
# From the project root directory
docker-compose up --build
```

This starts:
- MySQL on port 3306 (runs init.sql automatically)
- Memcached on port 11211
- RabbitMQ on port 5672 (management UI on 15672)
- Tomcat on port 8080 (with the portfolio.war deployed)

To run in the background:
```bash
docker-compose up --build -d
```

To stop:
```bash
docker-compose down
```

To stop and remove volumes (deletes MySQL data):
```bash
docker-compose down -v
```

---

## 12. Access the Portfolio

| URL | Description |
|---|---|
| `http://localhost:8080` | Portfolio homepage |
| `http://localhost:8080/api/health` | Backend health check (all services) |
| `http://localhost:8080/api/profile` | Profile API |
| `http://localhost:8080/api/skills` | Skills API |
| `http://localhost:8080/api/projects` | Projects API |
| `http://localhost:8080/api/education` | Education API |
| `http://localhost:8080/api/experience` | Experience API |
| `http://localhost:8080/api/contact` | Contact form (POST) |
| `http://localhost:15672` | RabbitMQ Management UI (guest / guest) |

---

## 13. Test Profile Cache Hit and Miss

### First request (cache empty → data from MySQL):

1. Open `http://localhost:8080`.
2. Click **VIEW MY DETAILS**.
3. The popup shows:  
   **SOURCE: MYSQL DATABASE** (blue badge)
4. This means: Java checked Memcached → miss → fetched from MySQL → stored in Memcached.

### Second request (data in cache → from Memcached):

1. Close the popup.
2. Click **VIEW MY DETAILS** again (within 300 seconds).
3. The popup shows:  
   **SOURCE: MEMCACHED CACHE** (purple badge)
4. This means: Java checked Memcached → hit → returned cached data.

### From the terminal (curl):

```bash
# First request → MYSQL
curl http://localhost:8080/api/profile | python -m json.tool

# Second request → MEMCACHED
curl http://localhost:8080/api/profile | python -m json.tool
```

---

## 14. Clear the Profile Cache

### Via the popup (UI):
Click **CLEAR PROFILE CACHE** in the Profile Details popup.  
Then click **Fetch Again** – the source badge will switch back to **MYSQL DATABASE**.

### Via curl:
```bash
curl -X DELETE http://localhost:8080/api/profile/cache
```

Response:
```json
{"message": "Profile cache cleared. Next request will fetch from MySQL."}
```

---

## 15. Inspect RabbitMQ Queues

Open the RabbitMQ Management UI:  
`http://localhost:15672`  
Login: `guest` / `guest`

1. Click **Queues** tab.
2. You should see `portfolio_contact_queue`.
3. Submit a contact form to publish a message and watch the queue metrics.

From Git Bash using the RabbitMQ HTTP API:
```bash
curl -s -u guest:guest http://localhost:15672/api/queues | python -m json.tool
```

---

## 16. Verify Contact Messages in MySQL

```bash
# Connect to MySQL in Docker
docker exec -it portfolio_mysql mysql -u portfolio_user -pportfolio_pass vineeth_portfolio

# View all received contact messages
SELECT id, sender_name, sender_email, subject, status, created_at, processed_at
FROM contact_messages
ORDER BY created_at DESC;
```

A processed message has:
- `status = 'processed'`
- `processed_at` timestamp filled in

---

## Technology Reference

| Technology | Version | Purpose |
|---|---|---|
| React | 18.x | Frontend UI |
| Vite | 5.x | Frontend build tool |
| Java | 17 | Backend language |
| Apache Tomcat | 10.1 | Application server |
| Jakarta Servlet | 6.0 | Servlet API (Jakarta EE 10) |
| Maven | 3.x | Backend build tool |
| MySQL Connector/J | 8.3 | JDBC driver |
| Spymemcached | 2.12.3 | Memcached Java client |
| RabbitMQ AMQP Client | 5.21 | RabbitMQ Java client |
| Jackson | 2.17 | JSON serialisation |
| Logback | 1.5 | Logging |
| MySQL | 8.x | Database |
| Memcached | 1.6 | In-memory cache |
| RabbitMQ | 3.x | Message broker |

---

*Built with ❤️ by Arun Vineeth J · Junior DevOps Engineer · Pudukkottai, Tamil Nadu, India*
=======
# VineethCloud
A full-stack DevOps portfolio application built with React, Java , Apache Tomcat, MySQL, Memcached, and RabbitMQ, containerized using Docker Composed. and deployed at Kubernetes 🚀
>>>>>>> d9141d87703fe6288db05050ba668c4ec3fe85a0
