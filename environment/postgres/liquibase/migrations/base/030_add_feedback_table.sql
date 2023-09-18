--liquibase formatted sql
--changeset csaba:030-survey-feedback-table

------------------------------------------------
-- DDL Statements for table BR7OWN.SURVEY_FEEDBACK
------------------------------------------------
CREATE TABLE br7own.survey_feedback  (
    id SERIAL PRIMARY KEY,
    response jsonb NOT NULL,
    feedback_type INTEGER NOT NULL,
    user_id INTEGER REFERENCES br7own.users(id),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX survey_feedback_created_at_idx ON br7own.survey_feedback(created_at);
