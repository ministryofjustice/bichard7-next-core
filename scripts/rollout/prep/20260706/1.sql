-- set onlyAccessToNewBichard flag to true
BEGIN;
UPDATE
  br7own.users
SET feature_flags = jsonb_set(feature_flags, '{onlyAccessToNewBichard}', 'true', true)
WHERE deleted_at IS NULL
  AND id IN (1017, 1165, 12607, 12608, 1076, 1579, 1117, 1066)
RETURNING id, username, email;
COMMIT;

-- rollback
BEGIN;
UPDATE
  br7own.users
SET feature_flags = jsonb_set(feature_flags, '{onlyAccessToNewBichard}', 'false', true)
WHERE deleted_at IS NULL
  AND id IN (1017, 1165, 12607, 12608, 1076, 1579, 1117, 1066)
RETURNING id, username, email;
COMMIT;
