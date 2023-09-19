--liquibase formatted sql
--changeset bjpirt:008-team-membership

------------------------------------------------
-- DDL Statements for table BR7OWN.TEAM_MEMBERSHIP
------------------------------------------------
 CREATE TABLE br7own.TEAM_MEMBERSHIP  (
	TEAM_ID INTEGER REFERENCES br7own.TEAM(TEAM_ID) ON DELETE CASCADE ,
 	MEMBER VARCHAR(32) NOT NULL );

-- DDL Statements for primary key on Table BR7OWN.TEAM_MEMBERSHIP
ALTER TABLE br7own.TEAM_MEMBERSHIP ADD PRIMARY KEY (TEAM_ID, MEMBER);
