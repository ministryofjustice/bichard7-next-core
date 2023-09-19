--
-- Conductor database is managed in our infrastructure code.
-- This is to create the database for local and CI testing
--

CREATE DATABASE conductor;
CREATE USER conductor WITH ENCRYPTED PASSWORD 'conductor';
GRANT ALL PRIVILEGES ON DATABASE conductor TO conductor;
