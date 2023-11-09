--liquibase formatted sql
--changeset emad:032_add_users_jwt_id_index runInTransaction:false

CREATE INDEX CONCURRENTLY users_jwt_id_idx ON br7own.users USING btree (jwt_id);
