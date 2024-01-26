--liquibase formatted sql
--changeset sen:033_note_length_limit_increase runInTransaction:false
ALTER TABLE "br7own"."error_list_notes"
ALTER COLUMN "note_text"
SET DATA TYPE varchar(2000);
