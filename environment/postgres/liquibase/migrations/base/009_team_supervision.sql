--liquibase formatted sql
--changeset bjpirt:009-team-supervision

------------------------------------------------
-- DDL Statements for table BR7OWN.TEAM_SUPERVISION
------------------------------------------------
 CREATE TABLE br7own.TEAM_SUPERVISION  (
	SUPERVISOR VARCHAR(32) NOT NULL ,
	TEAM_ID INTEGER REFERENCES br7own.TEAM(TEAM_ID) ON DELETE CASCADE
) ;

-- DDL Statements for primary key on Table BR7OWN.TEAM_SUPERVISION
ALTER TABLE br7own.TEAM_SUPERVISION ADD PRIMARY KEY (SUPERVISOR, TEAM_ID);
