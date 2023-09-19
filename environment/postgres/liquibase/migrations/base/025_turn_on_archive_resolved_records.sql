--liquibase formatted sql
--changeset mihai:025_urn_on_archive_resolved_records.sql

UPDATE cron.job SET active = TRUE WHERE jobname = 'archive_resolved_records';
