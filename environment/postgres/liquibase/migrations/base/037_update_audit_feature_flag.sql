--liquibase formatted sql
--changeset tom:037-update_audit_feature_flag

-- Update Made Tech users to have the feature flag for auditing enabled
-- This is so we can test the feature
UPDATE br7own.users
SET feature_flags = jsonb_set(feature_flags, '{useTriggerAndExceptionQualityAuditingEnabled}', 'true', true)
WHERE email LIKE '%@madetech.com' OR email LIKE '%@example.com';;