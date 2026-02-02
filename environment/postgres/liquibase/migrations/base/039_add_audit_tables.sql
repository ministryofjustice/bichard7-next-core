--liquibase formatted sql
--changeset tom:039_add_audit_tables

CREATE TABLE br7own.audits (
    audit_id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_by        VARCHAR   NOT NULL,
    created_when      TIMESTAMP NOT NULL,
    completed_when    TIMESTAMP,
    from_date         DATE NOT NULL,
    to_date           DATE NOT NULL,
    included_types    VARCHAR[],
    resolved_by_users VARCHAR[],
    trigger_types     VARCHAR[],
    volume_of_cases   SMALLINT NOT NULL
);

CREATE TABLE br7own.audit_cases (
    audit_case_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    audit_id INT REFERENCES br7own.audits(audit_id) NOT NULL,
    error_id INT REFERENCES br7own.error_list(error_id) NOT NULL
);

ALTER TABLE br7own.audit_cases
ADD CONSTRAINT audit_cases_audit_error_uq UNIQUE (audit_id, error_id);