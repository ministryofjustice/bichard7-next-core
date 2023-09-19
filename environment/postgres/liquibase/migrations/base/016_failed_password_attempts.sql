--liquibase formatted sql
--changeset mihai:016-failed-password-attempts

------------------------------------------------
-- DDL Statements for table BR7OWN.USERS
------------------------------------------------
ALTER TABLE br7own.users
ADD failed_password_attempts integer;
