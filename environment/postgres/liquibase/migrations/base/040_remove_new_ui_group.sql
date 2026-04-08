--liquibase formatted sql
--changeset tim:040_remove_new_ui_group

DELETE FROM br7own.users_groups
WHERE group_id = 10;

DELETE FROM br7own.groups
WHERE id = 10;