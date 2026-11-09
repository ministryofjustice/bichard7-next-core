BEGIN;
UPDATE
  br7own.users
SET
  feature_flags = jsonb_set(feature_flags, '{useTriggerAndExceptionQualityAuditingEnabled}', 'true', true)
WHERE
  id = 8979
RETURNING id, username, email;
COMMIT;
