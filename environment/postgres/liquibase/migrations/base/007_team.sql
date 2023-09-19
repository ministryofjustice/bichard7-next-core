--liquibase formatted sql
--changeset bjpirt:007-team

------------------------------------------------
-- DDL Statements for table BR7OWN.TEAM
------------------------------------------------
CREATE TABLE br7own.TEAM  (
    TEAM_ID SERIAL PRIMARY KEY,
    TEAM_NAME VARCHAR(32) NOT NULL ,
    OWNER VARCHAR(32) NOT NULL ,
    AREA VARCHAR(2)) ;
