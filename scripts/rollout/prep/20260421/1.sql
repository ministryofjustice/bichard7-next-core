BEGIN;
-- set onlyAccessToNewBichard flag to true
UPDATE
  br7own.users
SET
  feature_flags = jsonb_set(feature_flags, '{onlyAccessToNewBichard}', 'true', true)
WHERE
  deleted_at ISNULL AND
  id IN (1357, 1158, 409, 10429, 6700, 6667, 533, 6701, 10594, 621, 7921, 11189, 10595, 571, 596, 1596)
RETURNING id, username, email;

-- remove 'Supervisor' role from specified users
DELETE FROM
  br7own.users_groups
WHERE
  group_id = 5 AND
  user_id IN (1596, 621);

-- add 'General Handler' role to specified users
INSERT INTO br7own.users_groups (group_id, user_id)
VALUES 
  (4, 1596),
  (4, 621);
COMMIT;


-- rollback
BEGIN;
UPDATE
  br7own.users
SET
  feature_flags = jsonb_set(feature_flags, '{onlyAccessToNewBichard}', 'false', true)
WHERE
  deleted_at ISNULL AND
  id IN (1357, 1158, 409, 10429, 6700, 6667, 533, 6701, 10594, 621, 7921, 11189, 10595, 571, 596, 1596)
RETURNING id, username, email;

-- remove 'General Handler' role from specified users
DELETE FROM
  br7own.users_groups
WHERE
  group_id = 4 AND
  user_id IN (1596, 621)

-- add 'Supervisor' role to specified users
INSERT INTO br7own.users_groups (group_id, user_id)
VALUES 
  (5, 1596),
  (5, 621);
COMMIT;