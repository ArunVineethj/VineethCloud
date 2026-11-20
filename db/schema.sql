-- ============================================================
--  VineethCloud Portfolio – Database Schema
--  Run this file once to create the tables:
--    mysql -u root -p < db/schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS vineeth_portfolio
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE vineeth_portfolio;

-- ── Create application user (run as MySQL root) ───────────────
-- CREATE USER IF NOT EXISTS 'vineeth_user'@'localhost' IDENTIFIED BY 'your_password';
-- GRANT ALL PRIVILEGES ON vineeth_portfolio.* TO 'vineeth_user'@'localhost';
-- FLUSH PRIVILEGES;

-- ── Profile table ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profile (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  full_name            VARCHAR(150)  NOT NULL,
  designation          VARCHAR(200)  NOT NULL,
  location             VARCHAR(200),
  education            VARCHAR(200),
  college              VARCHAR(300),
  university           VARCHAR(300),
  cgpa                 VARCHAR(10),
  previous_company     VARCHAR(300),
  previous_role        VARCHAR(300),
  experience_duration  VARCHAR(100),
  technical_skills     TEXT,          -- comma-separated list
  created_at           DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Contact messages table ────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  sender_name  VARCHAR(150) NOT NULL,
  sender_email VARCHAR(255) NOT NULL,
  subject      VARCHAR(300),
  message      TEXT         NOT NULL,
  status       ENUM('PENDING','PROCESSED','FAILED') DEFAULT 'PENDING',
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
