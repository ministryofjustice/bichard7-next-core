BEGIN;
UPDATE
  br7own.users
SET
  feature_flags = jsonb_set(feature_flags, '{onlyAccessToNewBichard}', 'true', true)
WHERE
  deleted_at ISNULL AND
  id IN (8218,1507,4198,8548,11188,8219,1509,4197,2146,3169,4199,5644,4196,1368,155)
RETURNING id, username, email;
COMMIT;

BEGIN;
UPDATE
  br7own.users
SET
  feature_flags = jsonb_set(feature_flags, '{onlyAccessToNewBichard}', 'false', true)
WHERE
  deleted_at ISNULL AND
  id IN (8218,1507,4198,8548,11188,8219,1509,4197,2146,3169,4199,5644,4196,1368,155)
RETURNING id, username, email;
COMMIT;