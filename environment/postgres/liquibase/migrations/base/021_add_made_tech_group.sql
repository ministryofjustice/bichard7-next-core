--liquibase formatted sql
--changeset mihai:021-add_group

------------------------------------------------
-- DDL Statements for table BR7OWN.GROUPS
------------------------------------------------

INSERT INTO br7own.groups (name, friendly_name)
VALUES
    ('B7SuperUserManager_grp', 'Super User Manager')
