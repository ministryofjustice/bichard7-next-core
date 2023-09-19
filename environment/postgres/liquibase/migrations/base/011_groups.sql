--liquibase formatted sql
--changeset bjpirt:011-groups

------------------------------------------------
-- DDL Statements for table BR7OWN.GROUPS
------------------------------------------------
CREATE TABLE br7own.groups  (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    description TEXT
);

INSERT INTO br7own.groups (name)
VALUES
    ('B7Allocator_grp'),
    ('B7Audit_grp'),
    ('B7ExceptionHandler_grp'),
    ('B7GeneralHandler_grp'),
    ('B7Supervisor_grp'),
    ('B7TriggerHandler_grp'),
    ('B7UserManager_grp'),
    ('B7AuditLoggingManager_grp');
