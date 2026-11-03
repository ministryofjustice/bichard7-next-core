--liquibase formatted sql
--changeset caitlin:040_add_catchment_areas

CREATE TABLE br7own.catchment_areas (
    error_id    INTEGER PRIMARY KEY REFERENCES br7own.error_list(error_id) ON DELETE CASCADE,
    postcode    VARCHAR(10) NOT NULL,
    pfa_code    VARCHAR(20) NOT NULL,
    created_at  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX catchment_areas_pfa_code_idx ON br7own.catchment_areas(pfa_code);