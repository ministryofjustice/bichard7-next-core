--liquibase formatted sql
--changeset emad:027_add_new_ui_group.sql

INSERT INTO br7own."groups"
(name, description, friendly_name, parent_id)
VALUES('B7NewUI_grp', NULL, 'New Bichard UI', 0);


INSERT INTO br7own.users_groups (user_id, group_id)
	SELECT id, (SELECT id FROM br7own."groups" WHERE name = 'B7NewUI_grp') FROM br7own.users WHERE email LIKE '%@madetech.com' OR email LIKE '%@example.com';
