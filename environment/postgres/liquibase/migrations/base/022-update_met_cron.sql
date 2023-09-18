--liquibase formatted sql
--changeset bjpirt:022-update_met_cron

UPDATE cron.job SET command = 'SELECT br7own.archive_met_police_records(100)' WHERE command = 'SELECT br7own.archive_met_police_records()';
