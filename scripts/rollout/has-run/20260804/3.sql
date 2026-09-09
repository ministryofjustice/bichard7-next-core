-- set onlyAccessToNewBichard flag to true
BEGIN;
UPDATE
  br7own.users
SET
  feature_flags = jsonb_set(feature_flags, '{onlyAccessToNewBichard}', 'true', true)
WHERE
  deleted_at ISNULL AND
  id IN (1444,788,168,780,283,8845,454)
RETURNING id, username, email;
COMMIT;