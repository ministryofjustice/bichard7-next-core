DO
$$
    DECLARE
        errors_to_move INTEGER;
        triggers_to_move INTEGER;
        notes_to_move INTEGER;
        errors_moved INTEGER;
        triggers_moved INTEGER;
        notes_moved INTEGER;
        error_ids_to_move INTEGER[];
        function_output INTEGER[];
        before_record RECORD;
        after_record RECORD;
        archive_log_record_id INTEGER;
    BEGIN
        -- Check the first record to make sure the columns copy across correctly
        SELECT error_id, message_id, phase, error_status, trigger_status, error_quality_checked,
               trigger_quality_checked, trigger_count, error_locked_by_id, trigger_locked_by_id, is_urgent, asn,
               court_code, annotated_msg, updated_msg, error_report, create_ts, error_reason, trigger_reason,
               error_count, user_updated_flag, court_date, ptiurn, court_name, resolution_ts, msg_received_ts,
               error_resolved_by, trigger_resolved_by, error_resolved_ts, trigger_resolved_ts, defendant_name,
               org_for_police_filter, court_room, court_reference, error_insert_ts, trigger_insert_ts,
               pnc_update_enabled FROM br7own.error_list WHERE error_id = 1 INTO before_record;

        -- Check what we expect to move
        SELECT count(*) FROM br7own.error_list
            WHERE annotated_msg = 'to move' INTO errors_to_move;
        RAISE NOTICE 'Errors to move: %', errors_to_move;

        SELECT count(*) FROM br7own.error_list AS e, br7own.error_list_triggers AS t
            WHERE e.annotated_msg = 'to move' AND e.error_id = t.error_id INTO triggers_to_move;
        RAISE NOTICE 'Triggers to move: %', triggers_to_move;

        SELECT count(*) FROM br7own.error_list AS e, br7own.error_list_notes AS n
            WHERE e.annotated_msg = 'to move' AND e.error_id = n.error_id INTO notes_to_move;
        RAISE NOTICE 'Notes to move: %', notes_to_move;

        -- Archive the records
        SELECT ARRAY(SELECT error_id FROM br7own.error_list WHERE annotated_msg = 'to move') INTO error_ids_to_move;
        RAISE NOTICE 'Error IDs to move: %', error_ids_to_move;
        SELECT br7own.archive_error_records(error_ids_to_move, 'Test Archiver') INTO function_output;
        RAISE NOTICE 'Function output: %', function_output;
        ASSERT function_output = ARRAY[1,2,3,4,5], 'Function output was incorrect, expected "[1, 2, 3, 4, 5]"';

        -- Check the correct number of records have been archived
        SELECT count(*) FROM br7own.archive_error_list WHERE annotated_msg = 'to move' INTO errors_moved;
        RAISE NOTICE 'Errors moved: %', errors_moved;
        SELECT count(*) FROM br7own.archive_error_list AS e, br7own.archive_error_list_triggers AS t WHERE e.annotated_msg = 'to move' and e.error_id = t.error_id  INTO triggers_moved;
        RAISE NOTICE 'Triggers moved: %', triggers_moved;
        SELECT count(*) FROM br7own.archive_error_list AS e, br7own.archive_error_list_notes AS n WHERE e.annotated_msg = 'to move' and e.error_id = n.error_id INTO notes_moved;
        RAISE NOTICE 'Notes moved: %', notes_moved;
        ASSERT (errors_to_move = errors_moved), 'Incorrect number of error records moved';
        ASSERT (triggers_to_move = triggers_moved), 'Incorrect number of trigger records moved';
        ASSERT (notes_to_move = notes_moved), 'Incorrect number of note records moved';

        -- Check a record was copied across correctly
        SELECT error_id, message_id, phase, error_status, trigger_status, error_quality_checked,
               trigger_quality_checked, trigger_count, error_locked_by_id, trigger_locked_by_id, is_urgent, asn,
               court_code, annotated_msg, updated_msg, error_report, create_ts, error_reason, trigger_reason,
               error_count, user_updated_flag, court_date, ptiurn, court_name, resolution_ts, msg_received_ts,
               error_resolved_by, trigger_resolved_by, error_resolved_ts, trigger_resolved_ts, defendant_name,
               org_for_police_filter, court_room, court_reference, error_insert_ts, trigger_insert_ts,
               pnc_update_enabled FROM br7own.archive_error_list WHERE error_id = 1 INTO after_record;
        ASSERT before_record = after_record, 'Data copied does not match';

        -- Check we've tied all of the archived records to a log
        ASSERT (SELECT count(*) FROM br7own.archive_log) = 1,
            'Wrong number of archive logs created';
        SELECT log_id FROM br7own.archive_log INTO archive_log_record_id;
        ASSERT (SELECT count(*) FROM br7own.archive_error_list WHERE archive_log_id = archive_log_record_id) = errors_moved,
            'Archived errors do not all relate to the log';

        -- Check we've marked the log as being created by this function
        ASSERT (SELECT archived_by FROM br7own.archive_log) = 'Test Archiver',
            'Archive log creator field is incorrect';

        RAISE NOTICE 'Test passed';
    END
$$;

