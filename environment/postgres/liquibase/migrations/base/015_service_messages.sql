--liquibase formatted sql
--changeset emad:015-service-messages

------------------------------------------------
-- DDL Statements for table BR7OWN.SERVICE_MESSAGES
------------------------------------------------
CREATE TABLE br7own.service_messages  (
    id SERIAL PRIMARY KEY,
    message text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX service_messages_created_at_idx ON br7own.service_messages (created_at);
