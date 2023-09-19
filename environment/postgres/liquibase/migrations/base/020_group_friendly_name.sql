--liquibase formatted sql
--changeset sjblac:020-group_friendly_name

------------------------------------------------
-- DDL Statements for table BR7OWN.GROUPS
------------------------------------------------

ALTER TABLE br7own.groups
ADD COLUMN friendly_name VARCHAR(64);

UPDATE br7own.groups
SET friendly_name = 'Allocator' 
WHERE name = 'B7Allocator_grp';

UPDATE br7own.groups
SET friendly_name = 'Audit' 
WHERE name = 'B7Audit_grp';

UPDATE br7own.groups
SET friendly_name = 'Exception Handler' 
WHERE name = 'B7ExceptionHandler_grp';

UPDATE br7own.groups
SET friendly_name = 'General Handler' 
WHERE name = 'B7GeneralHandler_grp';

UPDATE br7own.groups
SET friendly_name = 'Supervisor' 
WHERE name = 'B7Supervisor_grp';

UPDATE br7own.groups
SET friendly_name = 'Trigger Handler' 
WHERE name = 'B7TriggerHandler_grp';

UPDATE br7own.groups
SET friendly_name = 'User Manager' 
WHERE name = 'B7UserManager_grp';

UPDATE br7own.groups
SET friendly_name = 'Audit Logging Manager' 
WHERE name = 'B7AuditLoggingManager_grp';

alter table br7own.groups alter column friendly_name set not null;