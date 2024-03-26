--liquibase formatted sql
--changeset bjpirt:035_error_list_index runInTransaction:false

-- Index the force code, trigger and error status in a composite index
create index concurrently err_lst_force_and_status_ix on br7own.error_list(br7own.force_code(org_for_police_filter), error_status, trigger_status);
