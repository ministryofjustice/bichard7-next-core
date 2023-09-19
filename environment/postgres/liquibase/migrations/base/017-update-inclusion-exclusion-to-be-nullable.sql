--liquibase formatted sql
--changeset mihai:0117-update-inclusion-exclusion-to-be-nullable

------------------------------------------------
-- DDL Statements for table BR7OWN.USERS
------------------------------------------------
ALTER TABLE br7own.users
ALTER inclusion_list DROP NOT NULL;
ALTER TABLE br7own.users
ALTER exclusion_list DROP NOT NULL;
