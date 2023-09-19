--liquibase formatted sql
--changeset mihai:014-password-history

------------------------------------------------
-- DDL Statements for table BR7OWN.PASSWORD_HISTORY
------------------------------------------------

CREATE TABLE br7own.password_history  (
    id serial PRIMARY KEY,
    user_id integer,
    password_hash varchar(128),
    last_used timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_password_history_user_id
        FOREIGN KEY(user_id)
        REFERENCES br7own.users(id)
        ON DELETE CASCADE
);
