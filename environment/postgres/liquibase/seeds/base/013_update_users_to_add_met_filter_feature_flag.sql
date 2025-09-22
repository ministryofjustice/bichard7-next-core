-- changeset tom:013_update_users_to_add_met_filter_feature_flag.sql
-- update users to have access to met filter feature

UPDATE br7own.users
SET feature_flags = jsonb_set(feature_flags, '{useCourtDateReceivedDateMismatchFiltersEnabled}', 'true', true)
WHERE email LIKE '%@madetech.com' OR email LIKE '%@example.com';