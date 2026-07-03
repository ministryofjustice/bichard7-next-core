-- set onlyAccessToNewBichard flag to true
BEGIN;
UPDATE
  br7own.users
SET feature_flags = jsonb_set(feature_flags, '{onlyAccessToNewBichard}', 'true', true)
WHERE deleted_at IS NULL
  AND id IN (37, 68, 77, 349, 679, 756, 765, 862, 1027, 1083, 1240, 1347, 1481, 1556,
             1557, 1558, 1559, 1560, 6536, 6537, 8681, 10330, 11518)
RETURNING id, username, email;
COMMIT;

-- rollback
BEGIN;
UPDATE
  br7own.users
SET feature_flags = jsonb_set(feature_flags, '{onlyAccessToNewBichard}', 'false', true)
WHERE deleted_at IS NULL
  AND id IN (37, 68, 77, 349, 679, 756, 765, 862, 1027, 1083, 1240, 1347, 1481, 1556,
             1557, 1558, 1559, 1560, 6536, 6537, 8681, 10330, 11518)
RETURNING id, username, email;
COMMIT;
