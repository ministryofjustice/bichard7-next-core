-- changeset tom:012_update_users_to_add_audit_feature_flag.sql
-- update users to have access to audit setting feature

UPDATE br7own.users
SET feature_flags = jsonb_set(feature_flags, '{useTriggerAndExceptionQualityAuditingEnabled}', 'true', true)
WHERE email LIKE '%@madetech.com' OR email LIKE '%@example.com';