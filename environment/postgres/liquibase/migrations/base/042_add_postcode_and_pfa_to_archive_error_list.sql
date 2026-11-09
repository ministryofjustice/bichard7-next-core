--liquibase formatted sql
--changeset tim:042_add_postcode_and_pfa_to_archive_error_list

ALTER TABLE br7own.archive_error_list 
ADD postcode VARCHAR(10),
ADD police_force_area VARCHAR(10);

