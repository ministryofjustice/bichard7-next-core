-- set onlyAccessToNewBichard flag to true
BEGIN;
UPDATE
  br7own.users
SET
  feature_flags = jsonb_set(feature_flags, '{onlyAccessToNewBichard}', 'true', true)
WHERE
  deleted_at ISNULL AND
  id IN (667,208,5215,11467,1161,211,11469,11470,1113,3631,210,11468,11471,982,1208,287,992,566,2245,1019,10066,1564,1060,1218,1233)
RETURNING id, username, email;
COMMIT;