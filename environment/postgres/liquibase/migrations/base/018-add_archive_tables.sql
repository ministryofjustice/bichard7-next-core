--liquibase formatted sql
--changeset bjpirt:018-add_archive_tables

CREATE TABLE br7own.archive_log
(
    log_id          SERIAL PRIMARY KEY,
    archived_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    archived_by     TEXT,
    audit_logged_at TIMESTAMP
);

CREATE INDEX archive_log_audit_logged_at_idx ON br7own.archive_log ( audit_logged_at );
CREATE INDEX archive_log_archived_at_idx ON br7own.archive_log ( archived_at );

CREATE TABLE br7own.archive_error_list
(
    error_id                INTEGER PRIMARY KEY,
    message_id              VARCHAR(70)   NOT NULL,
    phase                   INTEGER       NOT NULL,
    error_status            INTEGER,
    trigger_status          INTEGER,
    error_quality_checked   INTEGER,
    trigger_quality_checked INTEGER,
    trigger_count           INTEGER       NOT NULL,
    error_locked_by_id      VARCHAR(32),
    trigger_locked_by_id    VARCHAR(32),
    is_urgent               SMALLINT      NOT NULL,
    asn                     VARCHAR(21),
    court_code              VARCHAR(7),
    annotated_msg           TEXT          NOT NULL,
    updated_msg             TEXT,
    error_report            VARCHAR(1000) NOT NULL,
    create_ts               TIMESTAMP     NOT NULL,
    error_reason            VARCHAR(350),
    trigger_reason          VARCHAR(350),
    error_count             INTEGER       NOT NULL,
    user_updated_flag       SMALLINT      NOT NULL,
    court_date              DATE,
    ptiurn                  VARCHAR(11),
    court_name              VARCHAR(500),
    resolution_ts           TIMESTAMP,
    msg_received_ts         TIMESTAMP     NOT NULL,
    error_resolved_by       VARCHAR(32),
    trigger_resolved_by     VARCHAR(32),
    error_resolved_ts       TIMESTAMP,
    trigger_resolved_ts     TIMESTAMP,
    defendant_name          VARCHAR(500),
    org_for_police_filter   CHAR(6),
    court_room              VARCHAR(2),
    court_reference         VARCHAR(11)   NOT NULL,
    error_insert_ts         TIMESTAMP,
    trigger_insert_ts       TIMESTAMP,
    pnc_update_enabled      CHAR(1),
    archive_log_id          INTEGER REFERENCES br7own.archive_log (log_id) ON DELETE CASCADE
);

CREATE INDEX archive_error_list_archive_log_id_idx ON br7own.archive_error_list ( archive_log_id );

CREATE TABLE br7own.archive_error_list_notes
(
    note_id   INTEGER,
    error_id  INTEGER REFERENCES br7own.archive_error_list (error_id) ON DELETE CASCADE,
    note_text VARCHAR(1000) NOT NULL,
    user_id   VARCHAR(32)   NOT NULL,
    create_ts TIMESTAMP     NOT NULL
);

CREATE TABLE br7own.archive_error_list_triggers
(
    trigger_id            INTEGER,
    error_id              INTEGER REFERENCES br7own.archive_error_list (error_id) ON DELETE CASCADE,
    trigger_code          VARCHAR(8) NOT NULL,
    trigger_item_identity VARCHAR(10),
    status                INTEGER    NOT NULL,
    create_ts             TIMESTAMP  NOT NULL,
    resolved_by           VARCHAR(32),
    resolved_ts           TIMESTAMP
);
