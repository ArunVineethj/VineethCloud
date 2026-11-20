-- ============================================================
--  VineethCloud Portfolio – Seed Data
--  Run AFTER schema.sql:
--    mysql -u vineeth_user -p vineeth_portfolio < db/seed.sql
-- ============================================================

USE vineeth_portfolio;

-- Clear existing data before seeding (safe re-run)
TRUNCATE TABLE profile;

INSERT INTO profile (
  full_name,
  designation,
  location,
  education,
  college,
  university,
  cgpa,
  previous_company,
  previous_role,
  experience_duration,
  technical_skills
) VALUES (
  'ARUN VINEETH J',
  'Junior DevOps Engineer',
  'Pudukkottai, Tamil Nadu, India',
  'B.Sc Computer Science',
  'St. Joseph''s College, Tiruchirappalli',
  'Bharathidasan University',
  '8.3',
  'Capgemini',
  'Process Associate – Non Voice',
  '8 months',
  'AWS,Linux,Git,GitHub,Maven,Jenkins,Docker,Kubernetes,Helm,Java,Apache Tomcat,MySQL,Memcached,RabbitMQ'
);
