--liquibase formatted sql
--changeset bjpirt:003-error-list-notes

------------------------------------------------
-- DDL Statements for table BR7OWN.ERROR_LIST_NOTES
------------------------------------------------

 CREATE TABLE br7own.ERROR_LIST_NOTES  (
		  NOTE_ID SERIAL ,
		  ERROR_ID INTEGER REFERENCES br7own.ERROR_LIST(ERROR_ID) ON DELETE CASCADE,
		  NOTE_TEXT VARCHAR(1000) NOT NULL ,
		  USER_ID VARCHAR(32) NOT NULL ,
		  CREATE_TS TIMESTAMP NOT NULL ) ;


-- DDL Statements for index on ERROR_ID on Table BR7OWN.ERROR_LIST_NOTES
CREATE INDEX ERR_LST_NOTES_IX
        ON br7own.ERROR_LIST_NOTES (ERROR_ID);
