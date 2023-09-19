--liquibase formatted sql
--changeset bjpirt:archive_met_police_records runOnChange:true splitStatements:false

-- Archives the appropriate records for the Met Police
CREATE OR REPLACE FUNCTION br7own.archive_met_police_records(archive_limit INTEGER) RETURNS INTEGER[] AS
$met$
DECLARE
    records INTEGER[];
BEGIN
    WITH trigger_errors AS (
        SELECT distinct errors.error_id,
                        array_remove(array_remove(array_remove(array_remove(array(select trigger_code from br7own.error_list_triggers where error_id = errors.error_id), 'TRPR0002'), 'TRPR0012'), 'TRPR0023'), 'TRPR0024') as removed
        FROM br7own.error_list AS errors,
             br7own.error_list_triggers AS triggers
        WHERE (org_for_police_filter LIKE '01%')
          AND error_locked_by_id IS NULL
          AND trigger_locked_by_id IS NULL
          AND errors.error_id = triggers.error_id
          AND trigger_code IN ('TRPR0002','TRPR0012','TRPR0023','TRPR0024')
          AND msg_received_ts <= CURRENT_TIMESTAMP - INTERVAL '16 days'
        ),
    move_errors AS (
        select error_id from trigger_errors where array_length(removed, 1) is null
    )
    SELECT ARRAY(SELECT error_id FROM move_errors LIMIT archive_limit) INTO records;

    IF array_length(records, 1) > 0 THEN
        SELECT br7own.archive_error_records(records, 'Met Police Archiver') INTO records;
    END IF;
    RETURN records;
END;
$met$
LANGUAGE plpgsql
