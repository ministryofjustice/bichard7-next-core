--liquibase formatted sql
--changeset bjpirt:006-pnc-event-sequence

------------------------------------------------
-- DDL Statements for table BR7OWN.PNC_EVENT_SEQUENCE
------------------------------------------------
CREATE TABLE br7own.PNC_EVENT_SEQUENCE  (
    EVENT_SEQUENCE_ID SERIAL PRIMARY KEY,
    EVENT_CODE        VARCHAR(6) NOT NULL ,
    SEQUENCE_NUMBER   INTEGER NOT NULL ,
    DATA_CHANNEL_ID   INTEGER REFERENCES br7own.PNC_DATA_CHANNEL(DATA_CHANNEL_ID) ON DELETE CASCADE
);

-- Insert the event sequence counters
INSERT INTO br7own.PNC_EVENT_SEQUENCE (event_code, sequence_number, data_channel_id)
    VALUES
    ('SAPP', 1, 1),
    ('RDIS', 1, 1),
    ('GENL', 1, 1),
    ('ENQR', 1, 1)
