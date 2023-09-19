--liquibase formatted sql
--changeset bjpirt:005-pnc-data-channel

------------------------------------------------
-- DDL Statements for table BR7OWN.PNC_DATA_CHANNEL
------------------------------------------------
--
--  This table is the parent of a foreign key relationship with
--  br7own.pnc_event_sequence
--
CREATE TABLE br7own.PNC_DATA_CHANNEL  (
    DATA_CHANNEL_ID             INTEGER NOT NULL PRIMARY KEY,
    FORCE_NUMBER                VARCHAR(2) NOT NULL ,
    NID                         INTEGER NOT NULL ,
    NID_RANGE_START             INTEGER NOT NULL ,
    NID_RANGE_END               INTEGER NOT NULL ,
    LAST_NID_RESET              TIMESTAMP ,
    MANUAL_NID_RESET            SMALLINT NOT NULL ,
    LAST_EVENT_SEQUENCE_RESET   TIMESTAMP ,
    MANUAL_EVENT_SEQUENCE_RESET SMALLINT NOT NULL ,
    CHANNEL_TAKEN               TIMESTAMP );

-- DDL Statements for check constraints on Table BR7OWN.PNC_DATA_CHANNEL
ALTER TABLE br7own.PNC_DATA_CHANNEL
        ADD CONSTRAINT MAN_EVENT_SEQ_CK CHECK
                (MANUAL_EVENT_SEQUENCE_RESET in(0,1));

ALTER TABLE br7own.PNC_DATA_CHANNEL
        ADD CONSTRAINT NID_RESET_CK CHECK
                (MANUAL_NID_RESET in(0,1));

-- Insert a data channel
INSERT INTO br7own.PNC_DATA_CHANNEL (DATA_CHANNEL_ID, FORCE_NUMBER, NID, NID_RANGE_START, NID_RANGE_END, LAST_NID_RESET, MANUAL_NID_RESET, LAST_EVENT_SEQUENCE_RESET, MANUAL_EVENT_SEQUENCE_RESET, CHANNEL_TAKEN)
    VALUES (1, 73, 1, 1, 9999999, CURRENT_TIMESTAMP, 0, CURRENT_TIMESTAMP, 0, NULL);
