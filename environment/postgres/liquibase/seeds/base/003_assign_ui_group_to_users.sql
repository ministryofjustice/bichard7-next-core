-- Assign users to new UI group, if not already assigned

INSERT INTO br7own.users_groups
  SELECT u.id AS user_id, g.id AS groupd_id FROM br7own.users AS u, br7own.groups AS g 
  WHERE 
    g.name = 'B7NewUI_grp' AND
    u.username IN ('ben.pirt', 'emad.karamad', 'jamie.davies', 'simon.oldham', 'alice.lee', 'csaba.gyorfi', 'jazz.sarkaria', 'tom.vaughan', 'heather.roberts') AND
    NOT EXISTS(SELECT * FROM br7own.users_groups AS ug WHERE ug.user_id = u.id AND ug.group_id = g.id);
