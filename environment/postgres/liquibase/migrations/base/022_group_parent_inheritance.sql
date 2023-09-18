--liquibase formatted sql
--changeset mihai:022_group_parent_inheritance

------------------------------------------------
-- DDL Statements for table BR7OWN.GROUPS
------------------------------------------------

--B7SuperUserManager_grp
--├── B7AuditLoggingManager_grp
--└── B7UserManager_grp
--    ├── B7Audit_grp
--    └── B7Supervisor_grp
--        ├── B7Allocator_grp
--        └── B7GeneralHandler_grp
--            ├── B7ExceptionHandler_grp
--            └── B7TriggerHandler_grp

ALTER TABLE br7own.groups
ADD COLUMN parent_id INTEGER;

UPDATE br7own.groups
SET parent_id = (
    SELECT id
    FROM br7own.groups
    WHERE name = 'B7SuperUserManager_grp'
)
WHERE name = 'B7AuditLoggingManager_grp';

UPDATE br7own.groups
SET parent_id = (
    SELECT id
    FROM br7own.groups
    WHERE name = 'B7SuperUserManager_grp'
)
WHERE name = 'B7UserManager_grp';


UPDATE br7own.groups
SET parent_id = (
    SELECT id
    FROM br7own.groups
    WHERE name = 'B7UserManager_grp'
)
WHERE name = 'B7Audit_grp';

UPDATE br7own.groups
SET parent_id = (
    SELECT id
    FROM br7own.groups
    WHERE name = 'B7UserManager_grp'
)
WHERE name = 'B7Supervisor_grp';


UPDATE br7own.groups
SET parent_id = (
    SELECT id
    FROM br7own.groups
    WHERE name = 'B7Supervisor_grp'
)
WHERE name = 'B7Allocator_grp';

UPDATE br7own.groups
SET parent_id = (
    SELECT id
    FROM br7own.groups
    WHERE name = 'B7Supervisor_grp'
)
WHERE name = 'B7GeneralHandler_grp';


UPDATE br7own.groups
SET parent_id = (
    SELECT id
    FROM br7own.groups
    WHERE name = 'B7GeneralHandler_grp'
)
WHERE name = 'B7TriggerHandler_grp';

UPDATE br7own.groups
SET parent_id = (
    SELECT id
    FROM br7own.groups
    WHERE name = 'B7GeneralHandler_grp'
)
WHERE name = 'B7ExceptionHandler_grp';
