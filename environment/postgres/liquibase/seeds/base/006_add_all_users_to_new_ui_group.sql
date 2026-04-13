--- Ensure all users are added to the new UI group
INSERT INTO br7own.users_groups
  SELECT u.id AS user_id, g.id AS group_id FROM br7own.users AS u, br7own.groups AS g
  WHERE
    g.name = 'B7NewUI_grp' AND
    u.username != 'NoGroupsAssigned' AND
    NOT EXISTS(SELECT * FROM br7own.users_groups AS ug WHERE ug.user_id = u.id AND ug.group_id = g.id);
