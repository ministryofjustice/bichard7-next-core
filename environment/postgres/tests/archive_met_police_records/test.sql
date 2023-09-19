DO
$$
    DECLARE
        errors_to_move INTEGER;
        triggers_to_move INTEGER;
        notes_to_move INTEGER;
        errors_moved INTEGER;
        triggers_moved INTEGER;
        notes_moved INTEGER;
        function_output INTEGER[];
        archive_log_record_id INTEGER;
    BEGIN
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
        SELECT br7own.archive_met_police_records(1) INTO function_output;
        RAISE NOTICE 'Function output: %', function_output;
        ASSERT function_output = ARRAY[1], 'Function output was incorrect, expected "[1]"';

        SELECT br7own.archive_met_police_records(4) INTO function_output;
        RAISE NOTICE 'Function output: %', function_output;
        ASSERT function_output = ARRAY[2, 3, 4, 5], 'Function output was incorrect, expected "[2, 3, 4, 5]"';

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

        -- Check we've tied all of the archived records to a log
        ASSERT (SELECT count(*) FROM br7own.archive_log) = 2,
            'Wrong number of archive logs created';
        ASSERT (SELECT count(*) FROM br7own.archive_log as a JOIN br7own.archive_error_list as e ON a.log_id = e.archive_log_id WHERE a.archived_by = 'Met Police Archiver') = 5,
            'Archived errors do not all relate to the log';

        -- Check we've marked the log as being created by this function
        ASSERT (SELECT archived_by FROM br7own.archive_log limit 1) = 'Met Police Archiver',
            'Archive log creator field is incorrect';

        -- Check we don't create multiple archive_log records if there are no records to archive
        PERFORM br7own.archive_met_police_records(1000);
        ASSERT (SELECT COUNT(*) FROM br7own.archive_log) = 2,
            'Number of archive_log records is incorrect after second run';

        RAISE NOTICE 'Test passed';
    END
$$;

