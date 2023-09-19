--liquibase formatted sql
--changeset bjpirt:archive_error_records runOnChange:true splitStatements:false

-- Moves the specified error_list records into the archive tables along with their relations
CREATE OR REPLACE FUNCTION br7own.archive_error_records(records integer[], archived_by_name text) RETURNS INTEGER[] AS
$archive$
DECLARE
    result INTEGER[];
BEGIN
    WITH archive_log AS (
            INSERT INTO br7own.archive_log (archived_by) VALUES (archived_by_name) RETURNING *
        ),
        deleted_errors AS (
            DELETE FROM br7own.error_list WHERE error_id = ANY(records) RETURNING *
        ),
        errors AS (
            INSERT INTO br7own.archive_error_list
                SELECT error_id,
                       message_id,
                       phase,
                       error_status,
                       trigger_status,
                       error_quality_checked,
                       trigger_quality_checked,
                       trigger_count,
                       error_locked_by_id,
                       trigger_locked_by_id,
                       is_urgent,
                       asn,
                       court_code,
                       annotated_msg,
                       updated_msg,
                       error_report,
                       create_ts,
                       error_reason,
                       trigger_reason,
                       error_count,
                       user_updated_flag,
                       court_date,
                       ptiurn,
                       court_name,
                       resolution_ts,
                       msg_received_ts,
                       error_resolved_by,
                       trigger_resolved_by,
                       error_resolved_ts,
                       trigger_resolved_ts,
                       defendant_name,
                       org_for_police_filter,
                       court_room,
                       court_reference,
                       error_insert_ts,
                       trigger_insert_ts,
                       pnc_update_enabled,
                       (SELECT log_id FROM archive_log) AS archive_log_id
                FROM deleted_errors
                RETURNING *
        ),
        deleted_notes AS (
            DELETE FROM br7own.error_list_notes WHERE error_id = ANY(records) RETURNING *
        ),
        notes AS (
            INSERT INTO br7own.archive_error_list_notes SELECT * FROM deleted_notes RETURNING note_id
        ),
        deleted_triggers AS (
            DELETE FROM br7own.error_list_triggers WHERE error_id = ANY(records) RETURNING *
        ),
        triggers AS (
            INSERT INTO br7own.archive_error_list_triggers SELECT * FROM deleted_triggers RETURNING trigger_id
        )
        SELECT ARRAY(SELECT error_id FROM errors) INTO result;
    RETURN result;
END;
$archive$ LANGUAGE plpgsql
