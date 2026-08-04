-- set onlyAccessToNewBichard flag to true
BEGIN;
UPDATE
  br7own.users
SET
  feature_flags = jsonb_set(feature_flags, '{onlyAccessToNewBichard}', 'true', true)
WHERE
  deleted_at ISNULL AND
  id IN (679,756,765,862,349,1240,1481)
RETURNING id, username, email;
COMMIT;


-- rollback
BEGIN;
UPDATE
  br7own.users
SET
  feature_flags = jsonb_set(feature_flags, '{onlyAccessToNewBichard}', 'false', true)
WHERE
  deleted_at ISNULL AND
  id IN (679,756,765,862,349,1240,1481)
RETURNING id, username, email;
COMMIT;