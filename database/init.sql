-- ============================================================
-- vineeth_portfolio Database Initialization Script
-- ============================================================

CREATE DATABASE IF NOT EXISTS vineeth_portfolio
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE vineeth_portfolio;

-- ============================================================
-- TABLE: profile
-- ============================================================
CREATE TABLE IF NOT EXISTS profile (
  id            INT             NOT NULL AUTO_INCREMENT,
  full_name     VARCHAR(100)    NOT NULL,
  designation   VARCHAR(100)    NOT NULL,
  degree        VARCHAR(150)    NOT NULL,
  college       VARCHAR(200)    NOT NULL,
  university    VARCHAR(200)    NOT NULL,
  cgpa          VARCHAR(10)     NOT NULL,
  school        VARCHAR(200)    NOT NULL,
  location      VARCHAR(200)    NOT NULL,
  about_text    TEXT            NOT NULL,
  github_url    VARCHAR(300)    DEFAULT NULL,
  linkedin_url  VARCHAR(300)    DEFAULT NULL,
  email         VARCHAR(150)    DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: skills
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
  id         INT          NOT NULL AUTO_INCREMENT,
  name       VARCHAR(100) NOT NULL,
  category   VARCHAR(100) NOT NULL,
  icon_key   VARCHAR(100) NOT NULL,
  sort_order INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: projects
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id          INT          NOT NULL AUTO_INCREMENT,
  title       VARCHAR(200) NOT NULL,
  description TEXT         NOT NULL,
  tech_stack  VARCHAR(500) NOT NULL,
  github_url  VARCHAR(300) DEFAULT NULL,
  demo_url    VARCHAR(300) DEFAULT NULL,
  sort_order  INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: education
-- ============================================================
CREATE TABLE IF NOT EXISTS education (
  id           INT          NOT NULL AUTO_INCREMENT,
  degree       VARCHAR(200) NOT NULL,
  institution  VARCHAR(200) NOT NULL,
  university   VARCHAR(200) NOT NULL,
  year_range   VARCHAR(50)  NOT NULL,
  cgpa_grade   VARCHAR(20)  NOT NULL,
  sort_order   INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: experience
-- ============================================================
CREATE TABLE IF NOT EXISTS experience (
  id           INT          NOT NULL AUTO_INCREMENT,
  company      VARCHAR(200) NOT NULL,
  position     VARCHAR(200) NOT NULL,
  duration     VARCHAR(100) NOT NULL,
  description  TEXT         NOT NULL,
  exp_type     VARCHAR(50)  NOT NULL DEFAULT 'professional',
  sort_order   INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: contact_messages
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id           INT          NOT NULL AUTO_INCREMENT,
  sender_name  VARCHAR(150) NOT NULL,
  sender_email VARCHAR(200) NOT NULL,
  subject      VARCHAR(300) NOT NULL,
  message      TEXT         NOT NULL,
  status       VARCHAR(50)  NOT NULL DEFAULT 'received',
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  processed_at DATETIME     DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- SEED DATA: profile
-- ============================================================
INSERT INTO profile (
  full_name, designation, degree, college, university, cgpa,
  school, location, about_text, github_url, linkedin_url, email
) VALUES (
  'ARUN VINEETH J',
  'Junior DevOps Engineer',
  'B.Sc Computer Science',
  'St. Joseph''s College, Tiruchirappalli',
  'Bharathidasan University',
  '8.3',
  'St. Antony''s Higher Secondary School, Thanjavur',
  'Pudukkottai, Tamil Nadu, India',
  'A passionate Junior DevOps Engineer from Pudukkottai, Tamil Nadu. I am a Computer Science graduate from St. Joseph''s College, Tiruchirappalli, with a strong foundation in cloud infrastructure, automation, and modern DevOps practices. I am eager to contribute to real-world DevOps pipelines and help teams ship software faster and more reliably.',
  'https://github.com/arunvineeth',
  'https://linkedin.com/in/arunvineeth',
  'arunvineeth@example.com'
);

-- ============================================================
-- SEED DATA: skills
-- ============================================================
INSERT INTO skills (name, category, icon_key, sort_order) VALUES
('AWS',        'Cloud',        'aws',        1),
('Linux',      'OS',           'linux',      2),
('Docker',     'DevOps',       'docker',     3),
('Kubernetes', 'DevOps',       'kubernetes', 4),
('Jenkins',    'CI/CD',        'jenkins',    5),
('Git',        'Version Control', 'git',     6),
('Terraform',  'IaC',          'terraform',  7),
('Ansible',    'Automation',   'ansible',    8),
('CI/CD',      'DevOps',       'cicd',       9);

-- ============================================================
-- SEED DATA: projects
-- ============================================================
INSERT INTO projects (title, description, tech_stack, github_url, sort_order) VALUES
(
  'CI/CD Pipeline Automation',
  'Designed and implemented a fully automated CI/CD pipeline for a Java web application. The pipeline automatically builds, tests, and deploys the application on every code commit using Jenkins and Docker, reducing manual deployment effort by over 90%.',
  'Jenkins, Docker, Git, Maven, AWS EC2',
  'https://github.com/arunvineeth/cicd-pipeline',
  1
),
(
  'AWS Infrastructure Provisioning with Terraform',
  'Provisioned a complete AWS infrastructure including VPC, subnets, security groups, EC2 instances, RDS, and S3 using Terraform Infrastructure as Code. Enabled consistent, repeatable environment creation across development, staging, and production.',
  'Terraform, AWS, VPC, EC2, RDS, S3',
  'https://github.com/arunvineeth/terraform-aws-infra',
  2
),
(
  'Kubernetes Application Deployment',
  'Containerized a multi-tier web application using Docker and deployed it to a Kubernetes cluster. Configured Deployments, Services, ConfigMaps, and Persistent Volumes. Implemented horizontal pod autoscaling for high availability.',
  'Kubernetes, Docker, YAML, AWS EKS',
  'https://github.com/arunvineeth/k8s-deployment',
  3
),
(
  'Server Configuration with Ansible',
  'Developed Ansible playbooks to automate server provisioning and configuration management across multiple Linux servers. Automated package installation, user management, firewall rules, and application deployment.',
  'Ansible, Linux, YAML, AWS EC2',
  'https://github.com/arunvineeth/ansible-automation',
  4
),
(
  'Docker Containerization Project',
  'Containerized a full-stack portfolio application using Docker and Docker Compose. Defined multi-service architecture with Tomcat, MySQL, Memcached, and RabbitMQ. Implemented persistent volumes and service health checks.',
  'Docker, Docker Compose, Tomcat, MySQL, RabbitMQ, Memcached',
  'https://github.com/arunvineeth/docker-portfolio',
  5
);

-- ============================================================
-- SEED DATA: education
-- ============================================================
INSERT INTO education (degree, institution, university, year_range, cgpa_grade, sort_order) VALUES
(
  'B.Sc Computer Science',
  'St. Joseph''s College, Tiruchirappalli',
  'Bharathidasan University',
  '2020 – 2023',
  'CGPA: 8.3',
  1
),
(
  'Higher Secondary (12th)',
  'St. Antony''s Higher Secondary School, Thanjavur',
  'Tamil Nadu State Board',
  '2019 – 2020',
  'Score: 75%',
  2
),
(
  'SSLC (10th)',
  'St. Antony''s Higher Secondary School, Thanjavur',
  'Tamil Nadu State Board',
  '2017 – 2018',
  'Score: 80%',
  3
);

-- ============================================================
-- SEED DATA: experience
-- ============================================================
INSERT INTO experience (company, position, duration, description, exp_type, sort_order) VALUES
(
  'Capgemini',
  'Process Associate – Non Voice',
  '8 Months',
  'Worked as a Process Associate in a Non-Voice process at Capgemini. Handled back-office data processing, documentation, and quality assurance tasks. Developed strong attention to detail, process adherence, and professional communication skills. This role provided corporate work experience before transitioning to a DevOps career path.',
  'non_voice_process',
  1
);
