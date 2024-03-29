--liquibase formatted sql
--changeset bjpirt:unres_triggers runOnChange:true splitStatements:false

-- Returns a comma separated list of unresolved trigger codes for the given error
CREATE OR REPLACE FUNCTION BR7OWN.UNRES_TRIGGERS(ERRORID INT) RETURNS VARCHAR(32672) AS $$
DECLARE
    TRIGGERCODES VARCHAR(32672) DEFAULT '';
    TRIGGER RECORD;
BEGIN
    FOR TRIGGER IN (SELECT TRIGGER_CODE FROM BR7OWN.ERROR_LIST_TRIGGERS WHERE ERROR_ID = ERRORID AND STATUS = 1 ORDER BY TRIGGER_ID)
	LOOP
		TRIGGERCODES := TRIGGERCODES || TRIGGER.TRIGGER_CODE || ' ';
	END LOOP;
	RETURN RTRIM(TRIGGERCODES);
END;
$$ LANGUAGE plpgsql;
