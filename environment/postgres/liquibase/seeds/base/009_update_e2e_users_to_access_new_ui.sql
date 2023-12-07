--changeset joe-fol:009_update_e2e_users_to_access_new_ui.sql
-- update users to have access to new ui and fix permissions for general handler

INSERT INTO br7own.users_groups
SELECT u.id AS user_id, g.id AS group_id FROM br7own.users AS u, br7own.groups as g
WHERE
	g."name" IN ('B7TriggerHandler_grp', 'B7GeneralHandler_grp', 'B7NewUI_grp')
	AND u.username IN (
  'Bichard01', 'GeneralHandler1', 'GeneralHandler2', 'ben.pirt', 'emad.karamad', 'alice.lee', 'csaba.gyorfi', 'ian.king'
)
	AND NOT EXISTS(SELECT * FROM br7own.users_groups AS ug WHERE ug.user_id = u.id AND ug.group_id = g.id);

