--liquibase formatted sql
--changeset emad:028_add_pnc_failure-resubmission_columns.sql

ALTER TABLE br7own.error_list ADD LAST_PNC_FAILURE_RESUBMISSION_TS TIMESTAMP NULL;

ALTER TABLE br7own.error_list ADD TOTAL_PNC_FAILURE_RESUBMISSIONS INT DEFAULT(0) NOT NULL;
