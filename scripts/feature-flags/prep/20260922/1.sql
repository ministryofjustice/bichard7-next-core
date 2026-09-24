BEGIN;
UPDATE
  br7own.users
SET
  feature_flags = jsonb_set(feature_flags, '{useTriggerAndExceptionQualityAuditingEnabled}', 'true', true)
WHERE
  deleted_at ISNULL AND
  id IN (8416)
RETURNING id, username, email;
COMMIT;


-- rollback
BEGIN;
UPDATE
  br7own.users
SET
  feature_flags = jsonb_set(feature_flags, '{useTriggerAndExceptionQualityAuditingEnabled}', 'false', true)
WHERE
  deleted_at ISNULL AND
  id IN (8416)
RETURNING id, username, email;
COMMIT;