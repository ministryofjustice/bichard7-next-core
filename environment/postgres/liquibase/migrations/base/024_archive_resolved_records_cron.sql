--liquibase formatted sql
--changeset mihai:024_archive_resolved_records_cron.sql

SELECT cron.schedule ('archive_resolved_records','*/10 * * * *','SELECT br7own.archive_resolved_records(100)');

UPDATE cron.job SET active = FALSE WHERE command = 'SELECT br7own.archive_resolved_records(100)';
