--liquibase formatted sql
--changeset emad:036_notes_and_triggers_replica_identity runInTransaction:false

ALTER TABLE br7own.error_list_notes REPLICA IDENTITY FULL;
ALTER TABLE br7own.error_list_triggers REPLICA IDENTITY FULL;
ALTER TABLE br7own.archive_error_list_notes REPLICA IDENTITY FULL;
ALTER TABLE br7own.archive_error_list_triggers REPLICA IDENTITY FULL;
