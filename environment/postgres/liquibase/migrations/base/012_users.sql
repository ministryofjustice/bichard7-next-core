--liquibase formatted sql
--changeset bjpirt:012-users

------------------------------------------------
-- DDL Statements for table BR7OWN.USERS
------------------------------------------------
CREATE TABLE br7own.users  (
    id SERIAL PRIMARY KEY,
    username VARCHAR(64) NOT NULL,
    exclusion_list text NOT NULL,
    inclusion_list text NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    endorsed_by text,
    last_logged_in timestamp DEFAULT NULL,
    org_serves text,
    forenames VARCHAR(128),
    surname VARCHAR(64),
    email VARCHAR(128) NOT NULL,
    password varchar(128),
    last_login_attempt timestamp DEFAULT '2020-01-01 00:00:00',
    email_verification_code varchar(6),
    email_verification_generated timestamp DEFAULT '2020-01-01 00:00:00',
    deleted_at timestamp,
    password_reset_code varchar(6),
    migrated_password varchar,
    jwt_id varchar(50),
    jwt_generated_at timestamp,
    visible_courts varchar(256),
    visible_forces varchar(256),
    excluded_triggers varchar(512)
);

CREATE UNIQUE INDEX unique_users_username_idx ON br7own.users (lower(username));
CREATE UNIQUE INDEX unique_users_email_idx ON br7own.users (lower(email));
