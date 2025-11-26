--liquibase formatted sql
--changeset emad:038-add_hearing_outcome_json_columns

-- Add hearing_outcome and updated_hearing_outcome columns to store
-- AHO and PNC Update Dataset in JSON format in the table
ALTER TABLE br7own.error_list
  ADD COLUMN hearing_outcome jsonb DEFAULT NULL;

ALTER TABLE br7own.error_list
  ADD COLUMN updated_hearing_outcome jsonb DEFAULT NULL;
