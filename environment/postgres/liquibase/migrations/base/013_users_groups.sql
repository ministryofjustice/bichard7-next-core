--liquibase formatted sql
--changeset bjpirt:013-users-groups

------------------------------------------------
-- DDL Statements for table BR7OWN.USERS_GROUPS
------------------------------------------------
CREATE TABLE br7own.users_groups (
    user_id integer references br7own.users(id),
    group_id integer references br7own.groups(id),
    PRIMARY KEY (user_id, group_id)
);
