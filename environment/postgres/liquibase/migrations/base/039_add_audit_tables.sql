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
    audit_id INT NOT NULL REFERENCES br7own.audits(audit_id) ON DELETE CASCADE,
    error_id INT NOT NULL REFERENCES br7own.error_list(error_id) ON DELETE CASCADE,
    UNIQUE (audit_id, error_id)
);