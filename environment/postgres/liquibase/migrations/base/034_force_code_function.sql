--liquibase formatted sql
--changeset bjpirt:034_force_code_function splitStatements:false

-- Create new function to be used for indexing the force code
-- It's not with the other functions because we need to be sure it exists before using it
CREATE OR REPLACE FUNCTION br7own.force_code(org_code text) 
  RETURNS smallint
AS
$BODY$
    select SUBSTRING(org_code FROM '(\d{2})')::smallint;
$BODY$
LANGUAGE sql
IMMUTABLE;
