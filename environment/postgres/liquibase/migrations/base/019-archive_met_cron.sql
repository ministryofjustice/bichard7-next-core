--liquibase formatted sql
--changeset bjpirt:019-archive_met_cron

CREATE EXTENSION pg_cron;

SELECT cron.schedule ('met_police_cleardown','*/10 * * * *','SELECT br7own.archive_met_police_records()');

UPDATE cron.job SET active = FALSE;