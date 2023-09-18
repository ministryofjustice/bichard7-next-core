--liquibase formatted sql
--changeset mihai:archive_resolved_records runOnChange:true splitStatements:false

-- Moves the specified error_list records into the archive tables along with their relations
CREATE OR REPLACE FUNCTION br7own.archive_resolved_records(archive_limit INTEGER) RETURNS INTEGER[] AS
$resolved$
    DECLARE
        resolved_records INTEGER[];
    BEGIN
        SELECT ARRAY(
            SELECT ERROR_ID FROM br7own.ERROR_LIST
            WHERE resolution_ts IS NOT NULL
                AND date(resolution_ts) < CURRENT_TIMESTAMP - INTERVAL '366 days'
            LIMIT archive_limit
        ) INTO resolved_records;

        IF array_length(resolved_records, 1) > 0 THEN
            SELECT br7own.archive_error_records(resolved_records, 'Resolved record archiver') INTO resolved_records;
        END IF;
        RETURN resolved_records;
    END;
$resolved$
LANGUAGE plpgsql;
