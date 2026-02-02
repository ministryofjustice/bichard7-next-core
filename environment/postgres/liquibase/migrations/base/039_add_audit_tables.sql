--liquibase formatted sql
--changeset tom:039_add_audit_tables

CREATE TABLE br7own.audits
(
    audit_id          SERIAL PRIMARY KEY,
    created_by        VARCHAR   NOT NULL,
    created_when      TIMESTAMP NOT NULL,
    completed_when    TIMESTAMP,
    from_date         DATE,
    to_date           DATE,
    included_types    VARCHAR[],
    resolved_by_users VARCHAR[],
    trigger_types     VARCHAR[],
    volume_of_cases   SMALLINT
)
