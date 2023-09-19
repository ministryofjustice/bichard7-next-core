--liquibase formatted sql
--changeset alice:026_error_archival_recording.sql

ALTER TABLE br7own.archive_error_list
  ADD COLUMN audit_logged_at TIMESTAMP DEFAULT NULL;

ALTER TABLE br7own.archive_error_list
  ADD COLUMN audit_log_attempts INTEGER NOT NULL DEFAULT 0;
  