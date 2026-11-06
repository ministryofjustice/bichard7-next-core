--liquibase formatted sql
--changeset tim:041_add_ons_postcode_mappings

CREATE TABLE br7own.ons_postcode_mappings (
    postcode VARCHAR(10) PRIMARY KEY,
    police_force_area VARCHAR(10) NOT NULL
);

CREATE INDEX ons_postcode_mappings_postcode_idx ON br7own.ons_postcode_mappings(postcode);