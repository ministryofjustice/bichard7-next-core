--liquibase formatted sql
--changeset tomv:029_add_feature_flags.sql

ALTER TABLE br7own.users ADD feature_flags jsonb DEFAULT '{}';

UPDATE br7own.users SET feature_flags = '{"test_flag": true}' WHERE email LIKE '%@madetech.com' OR email LIKE '%@example.com';
