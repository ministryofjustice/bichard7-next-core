TRUNCATE TABLE br7own.error_list, br7own.archive_log CASCADE;

-- Record to move with TRPR0002 trigger
INSERT INTO br7own.error_list (error_id, msg_received_ts, error_locked_by_id, trigger_locked_by_id, message_id, phase,
                               trigger_count, error_count, is_urgent, annotated_msg, error_report, create_ts,
                               user_updated_flag, court_reference, org_for_police_filter, error_status, trigger_status,
                               error_quality_checked, trigger_quality_checked, asn, court_code, updated_msg,
                               error_reason, trigger_reason, court_date, ptiurn, court_name, resolution_ts,
                               error_resolved_by, trigger_resolved_by, error_resolved_ts, trigger_resolved_ts,
                               defendant_name, court_room, error_insert_ts, trigger_insert_ts, pnc_update_enabled)
VALUES (1, CURRENT_TIMESTAMP - INTERVAL '17 days', NULL, NULL, 'message01', 1, 1, 1, 0, 'to move', 'to move2',
        CURRENT_TIMESTAMP, 0, '', '01X', NULL, 4, 5, 6, 'asn', 'crtcode', 'updated_msg', 'error_reason', 'trigger_reason',
        CURRENT_TIMESTAMP, 'ptiurn', 'court_name', CURRENT_TIMESTAMP - INTERVAL '367 days', 'error_resolved_by', 'trigger_resolved_by',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'defendant_name', 'xx', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'x');

INSERT INTO br7own.error_list_triggers (error_id, trigger_code, status, create_ts)
VALUES (1, 'TRPR0002', 1, CURRENT_TIMESTAMP);

INSERT INTO br7own.error_list_notes (error_id, note_text, user_id, create_ts)
VALUES (1, '', '', CURRENT_TIMESTAMP);

-- Record to move with TRPR0012 trigger
INSERT INTO br7own.error_list (error_id, msg_received_ts, error_locked_by_id, trigger_locked_by_id, message_id, phase,
                               trigger_count, error_count, is_urgent,
                               annotated_msg,
                               error_report, create_ts, user_updated_flag, court_reference, org_for_police_filter)
VALUES (2, CURRENT_TIMESTAMP - INTERVAL '17 days', NULL, NULL, 'message02', 1, 1, 1, 0, 'to move', '', CURRENT_TIMESTAMP, 0, '', '01X');

INSERT INTO br7own.error_list_triggers (error_id, trigger_code, status, create_ts)
VALUES (2, 'TRPR0012', 1, CURRENT_TIMESTAMP);

INSERT INTO br7own.error_list_notes (error_id, note_text, user_id, create_ts)
VALUES (2, '', '', CURRENT_TIMESTAMP);

-- Record to move with TRPR0023 trigger
INSERT INTO br7own.error_list (error_id, msg_received_ts, error_locked_by_id, trigger_locked_by_id, message_id, phase,
                               trigger_count, error_count, is_urgent,
                               annotated_msg,
                               error_report, create_ts, user_updated_flag, court_reference, org_for_police_filter)
VALUES (3, CURRENT_TIMESTAMP - INTERVAL '17 days', NULL, NULL, 'message03', 1, 1, 1, 0, 'to move', '', CURRENT_TIMESTAMP, 0, '', '01X');

INSERT INTO br7own.error_list_triggers (error_id, trigger_code, status, create_ts)
VALUES (3, 'TRPR0023', 1, CURRENT_TIMESTAMP);

INSERT INTO br7own.error_list_notes (error_id, note_text, user_id, create_ts)
VALUES (3, '', '', CURRENT_TIMESTAMP);

-- Record to move with TRPR0024 trigger
INSERT INTO br7own.error_list (error_id, msg_received_ts, error_locked_by_id, trigger_locked_by_id, message_id, phase,
                               trigger_count, error_count, is_urgent,
                               annotated_msg,
                               error_report, create_ts, user_updated_flag, court_reference, org_for_police_filter)
VALUES (4, CURRENT_TIMESTAMP - INTERVAL '17 days', NULL, NULL, 'message04', 1, 1, 1, 0, 'to move', '', CURRENT_TIMESTAMP, 0, '', '01X');

INSERT INTO br7own.error_list_triggers (error_id, trigger_code, status, create_ts)
VALUES (4, 'TRPR0024', 1, CURRENT_TIMESTAMP);

INSERT INTO br7own.error_list_notes (error_id, note_text, user_id, create_ts)
VALUES (4, '', '', CURRENT_TIMESTAMP);

-- Record to move with more than one matching trigger
INSERT INTO br7own.error_list (error_id, msg_received_ts, error_locked_by_id, trigger_locked_by_id, message_id, phase,
                               trigger_count, error_count, is_urgent,
                               annotated_msg,
                               error_report, create_ts, user_updated_flag, court_reference, org_for_police_filter)
VALUES (5, CURRENT_TIMESTAMP - INTERVAL '17 days', NULL, NULL, 'message05', 1, 1, 1, 0, 'to move', '', CURRENT_TIMESTAMP, 0, '', '01X');

INSERT INTO br7own.error_list_triggers (error_id, trigger_code, status, create_ts)
VALUES (5, 'TRPR0002', 1, CURRENT_TIMESTAMP);

INSERT INTO br7own.error_list_triggers (error_id, trigger_code, status, create_ts)
VALUES (5, 'TRPR0012', 1, CURRENT_TIMESTAMP);

INSERT INTO br7own.error_list_triggers (error_id, trigger_code, status, create_ts)
VALUES (5, 'TRPR0023', 1, CURRENT_TIMESTAMP);

INSERT INTO br7own.error_list_triggers (error_id, trigger_code, status, create_ts)
VALUES (5, 'TRPR0024', 1, CURRENT_TIMESTAMP);

INSERT INTO br7own.error_list_notes (error_id, note_text, user_id, create_ts)
VALUES (5, '', '', CURRENT_TIMESTAMP);

-- Record to leave with only non-matching trigger
INSERT INTO br7own.error_list (error_id, msg_received_ts, error_locked_by_id, trigger_locked_by_id, message_id, phase,
                               trigger_count, error_count, is_urgent,
                               annotated_msg,
                               error_report, create_ts, user_updated_flag, court_reference, org_for_police_filter)
VALUES (6, CURRENT_TIMESTAMP - INTERVAL '17 days', NULL, NULL, 'message06', 1, 1, 1, 0, 'to leave', '', CURRENT_TIMESTAMP, 0, '', '01X');

INSERT INTO br7own.error_list_triggers (error_id, trigger_code, status, create_ts)
VALUES (6, 'TRPR0009', 1, CURRENT_TIMESTAMP);

INSERT INTO br7own.error_list_notes (error_id, note_text, user_id, create_ts)
VALUES (6, '', '', CURRENT_TIMESTAMP);

-- Record to leave with matching and non-matching trigger
INSERT INTO br7own.error_list (error_id, msg_received_ts, error_locked_by_id, trigger_locked_by_id, message_id, phase,
                               trigger_count, error_count, is_urgent,
                               annotated_msg,
                               error_report, create_ts, user_updated_flag, court_reference, org_for_police_filter)
VALUES (7, CURRENT_TIMESTAMP - INTERVAL '17 days', NULL, NULL, 'message07', 1, 1, 1, 0, 'to leave', '', CURRENT_TIMESTAMP, 0, '', '01X');

INSERT INTO br7own.error_list_triggers (error_id, trigger_code, status, create_ts)
VALUES (7, 'TRPR0009', 1, CURRENT_TIMESTAMP);

INSERT INTO br7own.error_list_triggers (error_id, trigger_code, status, create_ts)
VALUES (7, 'TRPR0002', 1, CURRENT_TIMESTAMP);

INSERT INTO br7own.error_list_notes (error_id, note_text, user_id, create_ts)
VALUES (7, '', '', CURRENT_TIMESTAMP);

-- Record to leave because of timestamp
INSERT INTO br7own.error_list (error_id, msg_received_ts, error_locked_by_id, trigger_locked_by_id, message_id, phase,
                               trigger_count, error_count, is_urgent,
                               annotated_msg,
                               error_report, create_ts, user_updated_flag, court_reference, org_for_police_filter)
VALUES (8, CURRENT_TIMESTAMP - INTERVAL '15 days', NULL, NULL, 'message08', 1, 1, 1, 0, 'to leave', '', CURRENT_TIMESTAMP, 0, '', '01X');

INSERT INTO br7own.error_list_triggers (error_id, trigger_code, status, create_ts)
VALUES (8, 'TRPR0002', 1, CURRENT_TIMESTAMP);

INSERT INTO br7own.error_list_notes (error_id, note_text, user_id, create_ts)
VALUES (8, '', '', CURRENT_TIMESTAMP);

-- Record to leave because it is for another force
INSERT INTO br7own.error_list (error_id, msg_received_ts, error_locked_by_id, trigger_locked_by_id, message_id, phase,
                               trigger_count, error_count, is_urgent,
                               annotated_msg,
                               error_report, create_ts, user_updated_flag, court_reference, org_for_police_filter)
VALUES (9, CURRENT_TIMESTAMP - INTERVAL '17 days', NULL, NULL, 'message09', 1, 1, 1, 0, 'to leave', '', CURRENT_TIMESTAMP, 0, '', '02X');

INSERT INTO br7own.error_list_triggers (error_id, trigger_code, status, create_ts)
VALUES (9, 'TRPR0002', 1, CURRENT_TIMESTAMP);

INSERT INTO br7own.error_list_notes (error_id, note_text, user_id, create_ts)
VALUES (9, '', '', CURRENT_TIMESTAMP);

-- Record to leave because the error is locked
INSERT INTO br7own.error_list (error_id, msg_received_ts, error_locked_by_id, trigger_locked_by_id, message_id, phase,
                               trigger_count, error_count, is_urgent,
                               annotated_msg,
                               error_report, create_ts, user_updated_flag, court_reference, org_for_police_filter)
VALUES (10, CURRENT_TIMESTAMP - INTERVAL '17 days', 'lockId', NULL, 'message10', 1, 1, 1, 0, 'to leave', '', CURRENT_TIMESTAMP, 0, '', '01X');

INSERT INTO br7own.error_list_triggers (error_id, trigger_code, status, create_ts)
VALUES (10, 'TRPR0002', 1, CURRENT_TIMESTAMP);

INSERT INTO br7own.error_list_notes (error_id, note_text, user_id, create_ts)
VALUES (10, '', '', CURRENT_TIMESTAMP);

-- Record to leave because the trigger is locked
INSERT INTO br7own.error_list (error_id, msg_received_ts, error_locked_by_id, trigger_locked_by_id, message_id, phase,
                               trigger_count, error_count, is_urgent,
                               annotated_msg,
                               error_report, create_ts, user_updated_flag, court_reference, org_for_police_filter)
VALUES (11, CURRENT_TIMESTAMP - INTERVAL '17 days', NULL, 'lockId', 'message11', 1, 1, 1, 0, 'to leave', '', CURRENT_TIMESTAMP, 0, '', '01X');

INSERT INTO br7own.error_list_triggers (error_id, trigger_code, status, create_ts)
VALUES (11, 'TRPR0002', 1, CURRENT_TIMESTAMP);

INSERT INTO br7own.error_list_notes (error_id, note_text, user_id, create_ts)
VALUES (11, '', '', CURRENT_TIMESTAMP);

-- Record to move with TRPR0002 trigger
INSERT INTO br7own.error_list (error_id, msg_received_ts, error_locked_by_id, trigger_locked_by_id, message_id, phase,
                               trigger_count, error_count, is_urgent, annotated_msg, error_report, create_ts,
                               user_updated_flag, court_reference, org_for_police_filter, error_status, trigger_status,
                               error_quality_checked, trigger_quality_checked, asn, court_code, updated_msg,
                               error_reason, trigger_reason, court_date, ptiurn, court_name, resolution_ts,
                               error_resolved_by, trigger_resolved_by, error_resolved_ts, trigger_resolved_ts,
                               defendant_name, court_room, error_insert_ts, trigger_insert_ts, pnc_update_enabled)
VALUES (12, CURRENT_TIMESTAMP - INTERVAL '17 days', NULL, NULL, 'message12', 1, 1, 1, 0, 'to resolve', 'to resolve2',
        CURRENT_TIMESTAMP, 0, '', '01X', NULL, 4, 5, 6, 'asn', 'crtcode', 'updated_msg', 'error_reason', 'trigger_reason',
        CURRENT_TIMESTAMP, 'ptiurn', 'court_name', CURRENT_TIMESTAMP - INTERVAL '367 days', 'error_resolved_by', 'trigger_resolved_by',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'defendant_name', 'xx', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'x');

INSERT INTO br7own.error_list (error_id, msg_received_ts, error_locked_by_id, trigger_locked_by_id, message_id, phase,
                               trigger_count, error_count, is_urgent, annotated_msg, error_report, create_ts,
                               user_updated_flag, court_reference, org_for_police_filter, error_status, trigger_status,
                               error_quality_checked, trigger_quality_checked, asn, court_code, updated_msg,
                               error_reason, trigger_reason, court_date, ptiurn, court_name, resolution_ts,
                               error_resolved_by, trigger_resolved_by, error_resolved_ts, trigger_resolved_ts,
                               defendant_name, court_room, error_insert_ts, trigger_insert_ts, pnc_update_enabled)
VALUES (13, CURRENT_TIMESTAMP - INTERVAL '17 days', NULL, NULL, 'message13', 1, 1, 1, 0, 'to resolve', 'to resolve2',
        CURRENT_TIMESTAMP, 0, '', '01X', NULL, 4, 5, 6, 'asn', 'crtcode', 'updated_msg', 'error_reason', 'trigger_reason',
        CURRENT_TIMESTAMP, 'ptiurn', 'court_name', CURRENT_TIMESTAMP - INTERVAL '367 days', 'error_resolved_by', 'trigger_resolved_by',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'defendant_name', 'xx', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'x');

INSERT INTO br7own.error_list (error_id, msg_received_ts, error_locked_by_id, trigger_locked_by_id, message_id, phase,
                               trigger_count, error_count, is_urgent, annotated_msg, error_report, create_ts,
                               user_updated_flag, court_reference, org_for_police_filter, error_status, trigger_status,
                               error_quality_checked, trigger_quality_checked, asn, court_code, updated_msg,
                               error_reason, trigger_reason, court_date, ptiurn, court_name, resolution_ts,
                               error_resolved_by, trigger_resolved_by, error_resolved_ts, trigger_resolved_ts,
                               defendant_name, court_room, error_insert_ts, trigger_insert_ts, pnc_update_enabled)
VALUES (14, CURRENT_TIMESTAMP - INTERVAL '17 days', NULL, NULL, 'message14', 1, 1, 1, 0, 'to resolve', 'to resolve2',
        CURRENT_TIMESTAMP, 0, '', '01X', NULL, 4, 5, 6, 'asn', 'crtcode', 'updated_msg', 'error_reason', 'trigger_reason',
        CURRENT_TIMESTAMP, 'ptiurn', 'court_name', CURRENT_TIMESTAMP - INTERVAL '367 days', 'error_resolved_by', 'trigger_resolved_by',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'defendant_name', 'xx', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'x');