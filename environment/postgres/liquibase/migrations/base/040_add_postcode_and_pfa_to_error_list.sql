--liquibase formatted sql
--changeset caitlin:040_add_postcode_and_pfa_to_error_list

ALTER TABLE br7own.error_list 
ADD postcode VARCHAR(10),
ADD police_force_area VARCHAR(10);

CREATE INDEX pfa_error_list_idx ON br7own.error_list(police_force_area);
