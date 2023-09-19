--liquibase formatted sql
--changeset emad:031_add_incident_date

ALTER TABLE br7own.service_messages
  ADD COLUMN incident_date timestamp DEFAULT NULL;
