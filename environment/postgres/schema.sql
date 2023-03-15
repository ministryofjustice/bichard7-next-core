--
-- PostgreSQL database dump
--

-- Dumped from database version 14.7 (Debian 14.7-1.pgdg110+1)
-- Dumped by pg_dump version 14.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: br7own; Type: SCHEMA; Schema: -; Owner: bichard
--

CREATE SCHEMA br7own;


ALTER SCHEMA br7own OWNER TO bichard;

--
-- Name: pg_cron; Type: EXTENSION; Schema: -; Owner: -
--

-- CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION pg_cron; Type: COMMENT; Schema: -; Owner:
--

-- COMMENT ON EXTENSION pg_cron IS 'Job scheduler for PostgreSQL';


--
-- Name: sysibm; Type: SCHEMA; Schema: -; Owner: bichard
--

CREATE SCHEMA sysibm;


ALTER SCHEMA sysibm OWNER TO bichard;

--
-- Name: archive_error_records(integer[], text); Type: FUNCTION; Schema: br7own; Owner: bichard
--

CREATE FUNCTION br7own.archive_error_records(records integer[], archived_by_name text) RETURNS integer[]
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION br7own.archive_error_records(records integer[], archived_by_name text) OWNER TO bichard;

--
-- Name: archive_met_police_records(integer); Type: FUNCTION; Schema: br7own; Owner: bichard
--

CREATE FUNCTION br7own.archive_met_police_records(archive_limit integer) RETURNS integer[]
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION br7own.archive_met_police_records(archive_limit integer) OWNER TO bichard;

--
-- Name: archive_resolved_records(integer); Type: FUNCTION; Schema: br7own; Owner: bichard
--

CREATE FUNCTION br7own.archive_resolved_records(archive_limit integer) RETURNS integer[]
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION br7own.archive_resolved_records(archive_limit integer) OWNER TO bichard;

--
-- Name: note_text(integer); Type: FUNCTION; Schema: br7own; Owner: bichard
--

CREATE FUNCTION br7own.note_text(err_id integer) RETURNS character varying
    LANGUAGE plpgsql
    AS $$
    BEGIN
        return (select concat(t.USER_ID, ': ', t.NOTE_TEXT)
            from (
                select USER_ID, NOTE_TEXT
                FROM BR7OWN.ERROR_LIST_NOTES
                WHERE ERROR_ID = ERR_ID
                and USER_ID != 'System'
                order by CREATE_TS
                desc fetch first row only)
            as t);
    END;
$$;


ALTER FUNCTION br7own.note_text(err_id integer) OWNER TO bichard;

--
-- Name: secondsdiff(timestamp without time zone, timestamp without time zone); Type: FUNCTION; Schema: br7own; Owner: bichard
--

CREATE FUNCTION br7own.secondsdiff(t1 timestamp without time zone, t2 timestamp without time zone) RETURNS integer
    LANGUAGE plpgsql
    AS $$
    BEGIN
        RETURN EXTRACT(EPOCH FROM T1) - EXTRACT(EPOCH FROM T2);
    END;
$$;


ALTER FUNCTION br7own.secondsdiff(t1 timestamp without time zone, t2 timestamp without time zone) OWNER TO bichard;

--
-- Name: secondsdiff(timestamp with time zone, timestamp with time zone); Type: FUNCTION; Schema: br7own; Owner: bichard
--

CREATE FUNCTION br7own.secondsdiff(t1 timestamp with time zone, t2 timestamp with time zone) RETURNS integer
    LANGUAGE plpgsql
    AS $$
    BEGIN
        RETURN EXTRACT(EPOCH FROM T1) - EXTRACT(EPOCH FROM T2);
    END;
$$;


ALTER FUNCTION br7own.secondsdiff(t1 timestamp with time zone, t2 timestamp with time zone) OWNER TO bichard;

--
-- Name: startofnextday(timestamp without time zone); Type: FUNCTION; Schema: br7own; Owner: bichard
--

CREATE FUNCTION br7own.startofnextday(t1 timestamp without time zone) RETURNS timestamp without time zone
    LANGUAGE plpgsql
    AS $$
    BEGIN
        RETURN cast((cast(T1 as date) + interval '1 day') as timestamp);
    END;
$$;


ALTER FUNCTION br7own.startofnextday(t1 timestamp without time zone) OWNER TO bichard;

--
-- Name: startofnextday(timestamp with time zone); Type: FUNCTION; Schema: br7own; Owner: bichard
--

CREATE FUNCTION br7own.startofnextday(t1 timestamp with time zone) RETURNS timestamp without time zone
    LANGUAGE plpgsql
    AS $$
    BEGIN
        RETURN cast((cast(T1 as date) + interval '1 day') as timestamp);
    END;
$$;


ALTER FUNCTION br7own.startofnextday(t1 timestamp with time zone) OWNER TO bichard;

--
-- Name: trigger_cd_status(integer, integer); Type: FUNCTION; Schema: br7own; Owner: bichard
--

CREATE FUNCTION br7own.trigger_cd_status(err_id integer, res_status integer) RETURNS character varying
    LANGUAGE plpgsql
    AS $$
    BEGIN
        return (
            select REPLACE(
            REPLACE(
                REPLACE(
                    XMLSERIALIZE(
                        CONTENT XMLAGG(
                            XMLELEMENT(name "X", trigger_code) order by trigger_code
                        ) AS VARCHAR(750)
                    ), '</X><X>', ','), '<X>', ''), '</X>', '')
            from (select distinct trigger_code from BR7OWN.ERROR_LIST_TRIGGERS
            where ERROR_ID = ERR_ID AND STATUS = RES_STATUS fetch first 50 rows only) as sub);
    END;
$$;


ALTER FUNCTION br7own.trigger_cd_status(err_id integer, res_status integer) OWNER TO bichard;

--
-- Name: unres_triggers(integer); Type: FUNCTION; Schema: br7own; Owner: bichard
--

CREATE FUNCTION br7own.unres_triggers(errorid integer) RETURNS character varying
    LANGUAGE plpgsql
    AS $$
DECLARE
    TRIGGERCODES VARCHAR(32672) DEFAULT '';
    TRIGGER RECORD;
BEGIN
    FOR TRIGGER IN (SELECT TRIGGER_CODE FROM BR7OWN.ERROR_LIST_TRIGGERS WHERE ERROR_ID = ERRORID AND STATUS = 1 ORDER BY TRIGGER_ID)
	LOOP
		TRIGGERCODES := TRIGGERCODES || TRIGGER.TRIGGER_CODE || ' ';
	END LOOP;
	RETURN RTRIM(TRIGGERCODES);
END;
$$;


ALTER FUNCTION br7own.unres_triggers(errorid integer) OWNER TO bichard;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: archive_error_list; Type: TABLE; Schema: br7own; Owner: bichard
--

CREATE TABLE br7own.archive_error_list (
    error_id integer NOT NULL,
    message_id character varying(70) NOT NULL,
    phase integer NOT NULL,
    error_status integer,
    trigger_status integer,
    error_quality_checked integer,
    trigger_quality_checked integer,
    trigger_count integer NOT NULL,
    error_locked_by_id character varying(32),
    trigger_locked_by_id character varying(32),
    is_urgent smallint NOT NULL,
    asn character varying(21),
    court_code character varying(7),
    annotated_msg text NOT NULL,
    updated_msg text,
    error_report character varying(1000) NOT NULL,
    create_ts timestamp without time zone NOT NULL,
    error_reason character varying(350),
    trigger_reason character varying(350),
    error_count integer NOT NULL,
    user_updated_flag smallint NOT NULL,
    court_date date,
    ptiurn character varying(11),
    court_name character varying(500),
    resolution_ts timestamp without time zone,
    msg_received_ts timestamp without time zone NOT NULL,
    error_resolved_by character varying(32),
    trigger_resolved_by character varying(32),
    error_resolved_ts timestamp without time zone,
    trigger_resolved_ts timestamp without time zone,
    defendant_name character varying(500),
    org_for_police_filter character(6),
    court_room character varying(2),
    court_reference character varying(11) NOT NULL,
    error_insert_ts timestamp without time zone,
    trigger_insert_ts timestamp without time zone,
    pnc_update_enabled character(1),
    archive_log_id integer,
    audit_logged_at timestamp without time zone,
    audit_log_attempts integer DEFAULT 0 NOT NULL
);


ALTER TABLE br7own.archive_error_list OWNER TO bichard;

--
-- Name: archive_error_list_notes; Type: TABLE; Schema: br7own; Owner: bichard
--

CREATE TABLE br7own.archive_error_list_notes (
    note_id integer,
    error_id integer,
    note_text character varying(1000) NOT NULL,
    user_id character varying(32) NOT NULL,
    create_ts timestamp without time zone NOT NULL
);


ALTER TABLE br7own.archive_error_list_notes OWNER TO bichard;

--
-- Name: archive_error_list_triggers; Type: TABLE; Schema: br7own; Owner: bichard
--

CREATE TABLE br7own.archive_error_list_triggers (
    trigger_id integer,
    error_id integer,
    trigger_code character varying(8) NOT NULL,
    trigger_item_identity character varying(10),
    status integer NOT NULL,
    create_ts timestamp without time zone NOT NULL,
    resolved_by character varying(32),
    resolved_ts timestamp without time zone
);


ALTER TABLE br7own.archive_error_list_triggers OWNER TO bichard;

--
-- Name: archive_log; Type: TABLE; Schema: br7own; Owner: bichard
--

CREATE TABLE br7own.archive_log (
    log_id integer NOT NULL,
    archived_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    archived_by text,
    audit_logged_at timestamp without time zone
);


ALTER TABLE br7own.archive_log OWNER TO bichard;

--
-- Name: archive_log_log_id_seq; Type: SEQUENCE; Schema: br7own; Owner: bichard
--

CREATE SEQUENCE br7own.archive_log_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE br7own.archive_log_log_id_seq OWNER TO bichard;

--
-- Name: archive_log_log_id_seq; Type: SEQUENCE OWNED BY; Schema: br7own; Owner: bichard
--

ALTER SEQUENCE br7own.archive_log_log_id_seq OWNED BY br7own.archive_log.log_id;


--
-- Name: error_list; Type: TABLE; Schema: br7own; Owner: bichard
--

CREATE TABLE br7own.error_list (
    error_id integer NOT NULL,
    message_id character varying(70) NOT NULL,
    phase integer NOT NULL,
    error_status integer,
    trigger_status integer,
    error_quality_checked integer,
    trigger_quality_checked integer,
    trigger_count integer NOT NULL,
    error_locked_by_id character varying(32),
    trigger_locked_by_id character varying(32),
    is_urgent smallint NOT NULL,
    asn character varying(21),
    court_code character varying(7),
    annotated_msg text NOT NULL,
    updated_msg text,
    error_report character varying(1000) NOT NULL,
    create_ts timestamp without time zone NOT NULL,
    error_reason character varying(350),
    trigger_reason character varying(350),
    error_count integer NOT NULL,
    user_updated_flag smallint NOT NULL,
    court_date date,
    ptiurn character varying(11),
    court_name character varying(500),
    resolution_ts timestamp without time zone,
    msg_received_ts timestamp without time zone NOT NULL,
    error_resolved_by character varying(32),
    trigger_resolved_by character varying(32),
    error_resolved_ts timestamp without time zone,
    trigger_resolved_ts timestamp without time zone,
    defendant_name character varying(500),
    org_for_police_filter character(6),
    court_room character varying(2),
    court_reference character varying(11) NOT NULL,
    error_insert_ts timestamp without time zone,
    trigger_insert_ts timestamp without time zone,
    pnc_update_enabled character(1),
    defendant_name_upper character varying(200) GENERATED ALWAYS AS (upper((defendant_name)::text)) STORED,
    court_name_upper character varying(200) GENERATED ALWAYS AS (upper((court_name)::text)) STORED,
    last_pnc_failure_resubmission_ts timestamp without time zone,
    total_pnc_failure_resubmissions integer DEFAULT 0 NOT NULL
);


ALTER TABLE br7own.error_list OWNER TO bichard;

--
-- Name: error_list_error_id_seq; Type: SEQUENCE; Schema: br7own; Owner: bichard
--

CREATE SEQUENCE br7own.error_list_error_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE br7own.error_list_error_id_seq OWNER TO bichard;

--
-- Name: error_list_error_id_seq; Type: SEQUENCE OWNED BY; Schema: br7own; Owner: bichard
--

ALTER SEQUENCE br7own.error_list_error_id_seq OWNED BY br7own.error_list.error_id;


--
-- Name: error_list_notes; Type: TABLE; Schema: br7own; Owner: bichard
--

CREATE TABLE br7own.error_list_notes (
    note_id integer NOT NULL,
    error_id integer,
    note_text character varying(1000) NOT NULL,
    user_id character varying(32) NOT NULL,
    create_ts timestamp without time zone NOT NULL
);


ALTER TABLE br7own.error_list_notes OWNER TO bichard;

--
-- Name: error_list_notes_note_id_seq; Type: SEQUENCE; Schema: br7own; Owner: bichard
--

CREATE SEQUENCE br7own.error_list_notes_note_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE br7own.error_list_notes_note_id_seq OWNER TO bichard;

--
-- Name: error_list_notes_note_id_seq; Type: SEQUENCE OWNED BY; Schema: br7own; Owner: bichard
--

ALTER SEQUENCE br7own.error_list_notes_note_id_seq OWNED BY br7own.error_list_notes.note_id;


--
-- Name: error_list_triggers; Type: TABLE; Schema: br7own; Owner: bichard
--

CREATE TABLE br7own.error_list_triggers (
    trigger_id integer NOT NULL,
    error_id integer,
    trigger_code character varying(8) NOT NULL,
    trigger_item_identity character varying(10),
    status integer NOT NULL,
    create_ts timestamp without time zone NOT NULL,
    resolved_by character varying(32),
    resolved_ts timestamp without time zone
);


ALTER TABLE br7own.error_list_triggers OWNER TO bichard;

--
-- Name: error_list_triggers_trigger_id_seq; Type: SEQUENCE; Schema: br7own; Owner: bichard
--

CREATE SEQUENCE br7own.error_list_triggers_trigger_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE br7own.error_list_triggers_trigger_id_seq OWNER TO bichard;

--
-- Name: error_list_triggers_trigger_id_seq; Type: SEQUENCE OWNED BY; Schema: br7own; Owner: bichard
--

ALTER SEQUENCE br7own.error_list_triggers_trigger_id_seq OWNED BY br7own.error_list_triggers.trigger_id;


--
-- Name: groups; Type: TABLE; Schema: br7own; Owner: bichard
--

CREATE TABLE br7own.groups (
    id integer NOT NULL,
    name character varying(64) NOT NULL,
    description text,
    friendly_name character varying(64) NOT NULL,
    parent_id integer
);


ALTER TABLE br7own.groups OWNER TO bichard;

--
-- Name: groups_id_seq; Type: SEQUENCE; Schema: br7own; Owner: bichard
--

CREATE SEQUENCE br7own.groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE br7own.groups_id_seq OWNER TO bichard;

--
-- Name: groups_id_seq; Type: SEQUENCE OWNED BY; Schema: br7own; Owner: bichard
--

ALTER SEQUENCE br7own.groups_id_seq OWNED BY br7own.groups.id;


--
-- Name: password_history; Type: TABLE; Schema: br7own; Owner: bichard
--

CREATE TABLE br7own.password_history (
    id integer NOT NULL,
    user_id integer,
    password_hash character varying(128),
    last_used timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE br7own.password_history OWNER TO bichard;

--
-- Name: password_history_id_seq; Type: SEQUENCE; Schema: br7own; Owner: bichard
--

CREATE SEQUENCE br7own.password_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE br7own.password_history_id_seq OWNER TO bichard;

--
-- Name: password_history_id_seq; Type: SEQUENCE OWNED BY; Schema: br7own; Owner: bichard
--

ALTER SEQUENCE br7own.password_history_id_seq OWNED BY br7own.password_history.id;


--
-- Name: pnc_data_channel; Type: TABLE; Schema: br7own; Owner: bichard
--

CREATE TABLE br7own.pnc_data_channel (
    data_channel_id integer NOT NULL,
    force_number character varying(2) NOT NULL,
    nid integer NOT NULL,
    nid_range_start integer NOT NULL,
    nid_range_end integer NOT NULL,
    last_nid_reset timestamp without time zone,
    manual_nid_reset smallint NOT NULL,
    last_event_sequence_reset timestamp without time zone,
    manual_event_sequence_reset smallint NOT NULL,
    channel_taken timestamp without time zone,
    CONSTRAINT man_event_seq_ck CHECK ((manual_event_sequence_reset = ANY (ARRAY[0, 1]))),
    CONSTRAINT nid_reset_ck CHECK ((manual_nid_reset = ANY (ARRAY[0, 1])))
);


ALTER TABLE br7own.pnc_data_channel OWNER TO bichard;

--
-- Name: pnc_event_sequence; Type: TABLE; Schema: br7own; Owner: bichard
--

CREATE TABLE br7own.pnc_event_sequence (
    event_sequence_id integer NOT NULL,
    event_code character varying(6) NOT NULL,
    sequence_number integer NOT NULL,
    data_channel_id integer
);


ALTER TABLE br7own.pnc_event_sequence OWNER TO bichard;

--
-- Name: pnc_event_sequence_event_sequence_id_seq; Type: SEQUENCE; Schema: br7own; Owner: bichard
--

CREATE SEQUENCE br7own.pnc_event_sequence_event_sequence_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE br7own.pnc_event_sequence_event_sequence_id_seq OWNER TO bichard;

--
-- Name: pnc_event_sequence_event_sequence_id_seq; Type: SEQUENCE OWNED BY; Schema: br7own; Owner: bichard
--

ALTER SEQUENCE br7own.pnc_event_sequence_event_sequence_id_seq OWNED BY br7own.pnc_event_sequence.event_sequence_id;


--
-- Name: service_messages; Type: TABLE; Schema: br7own; Owner: bichard
--

CREATE TABLE br7own.service_messages (
    id integer NOT NULL,
    message text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE br7own.service_messages OWNER TO bichard;

--
-- Name: service_messages_id_seq; Type: SEQUENCE; Schema: br7own; Owner: bichard
--

CREATE SEQUENCE br7own.service_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE br7own.service_messages_id_seq OWNER TO bichard;

--
-- Name: service_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: br7own; Owner: bichard
--

ALTER SEQUENCE br7own.service_messages_id_seq OWNED BY br7own.service_messages.id;


--
-- Name: team; Type: TABLE; Schema: br7own; Owner: bichard
--

CREATE TABLE br7own.team (
    team_id integer NOT NULL,
    team_name character varying(32) NOT NULL,
    owner character varying(32) NOT NULL,
    area character varying(2)
);


ALTER TABLE br7own.team OWNER TO bichard;

--
-- Name: team_membership; Type: TABLE; Schema: br7own; Owner: bichard
--

CREATE TABLE br7own.team_membership (
    team_id integer NOT NULL,
    member character varying(32) NOT NULL
);


ALTER TABLE br7own.team_membership OWNER TO bichard;

--
-- Name: team_supervision; Type: TABLE; Schema: br7own; Owner: bichard
--

CREATE TABLE br7own.team_supervision (
    supervisor character varying(32) NOT NULL,
    team_id integer NOT NULL
);


ALTER TABLE br7own.team_supervision OWNER TO bichard;

--
-- Name: team_team_id_seq; Type: SEQUENCE; Schema: br7own; Owner: bichard
--

CREATE SEQUENCE br7own.team_team_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE br7own.team_team_id_seq OWNER TO bichard;

--
-- Name: team_team_id_seq; Type: SEQUENCE OWNED BY; Schema: br7own; Owner: bichard
--

ALTER SEQUENCE br7own.team_team_id_seq OWNED BY br7own.team.team_id;


--
-- Name: users; Type: TABLE; Schema: br7own; Owner: bichard
--

CREATE TABLE br7own.users (
    id integer NOT NULL,
    username character varying(64) NOT NULL,
    exclusion_list text,
    inclusion_list text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    endorsed_by text,
    last_logged_in timestamp without time zone,
    org_serves text,
    forenames character varying(128),
    surname character varying(64),
    email character varying(128) NOT NULL,
    password character varying(128),
    last_login_attempt timestamp without time zone DEFAULT '2020-01-01 00:00:00'::timestamp without time zone,
    email_verification_code character varying(6),
    email_verification_generated timestamp without time zone DEFAULT '2020-01-01 00:00:00'::timestamp without time zone,
    deleted_at timestamp without time zone,
    password_reset_code character varying(6),
    migrated_password character varying,
    jwt_id character varying(50),
    jwt_generated_at timestamp without time zone,
    visible_courts character varying(256),
    visible_forces character varying(256),
    excluded_triggers character varying(512),
    failed_password_attempts integer,
    feature_flags jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE br7own.users OWNER TO bichard;

--
-- Name: users_groups; Type: TABLE; Schema: br7own; Owner: bichard
--

CREATE TABLE br7own.users_groups (
    user_id integer NOT NULL,
    group_id integer NOT NULL
);


ALTER TABLE br7own.users_groups OWNER TO bichard;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: br7own; Owner: bichard
--

CREATE SEQUENCE br7own.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE br7own.users_id_seq OWNER TO bichard;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: br7own; Owner: bichard
--

ALTER SEQUENCE br7own.users_id_seq OWNED BY br7own.users.id;


--
-- Name: work_allocation_report; Type: TABLE; Schema: br7own; Owner: bichard
--

CREATE TABLE br7own.work_allocation_report (
    area_code character varying(2) NOT NULL,
    report bytea NOT NULL,
    report_timestamp timestamp without time zone NOT NULL
);


ALTER TABLE br7own.work_allocation_report OWNER TO bichard;

--
-- Name: databasechangelog; Type: TABLE; Schema: public; Owner: bichard
--

CREATE TABLE public.databasechangelog (
    id character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    filename character varying(255) NOT NULL,
    dateexecuted timestamp without time zone NOT NULL,
    orderexecuted integer NOT NULL,
    exectype character varying(10) NOT NULL,
    md5sum character varying(35),
    description character varying(255),
    comments character varying(255),
    tag character varying(255),
    liquibase character varying(20),
    contexts character varying(255),
    labels character varying(255),
    deployment_id character varying(10)
);


ALTER TABLE public.databasechangelog OWNER TO bichard;

--
-- Name: databasechangeloglock; Type: TABLE; Schema: public; Owner: bichard
--

CREATE TABLE public.databasechangeloglock (
    id integer NOT NULL,
    locked boolean NOT NULL,
    lockgranted timestamp without time zone,
    lockedby character varying(255)
);


ALTER TABLE public.databasechangeloglock OWNER TO bichard;

--
-- Name: sysdummy1; Type: VIEW; Schema: sysibm; Owner: bichard
--

CREATE VIEW sysibm.sysdummy1 AS
 SELECT 'X'::character(1) AS ibmreqd;


ALTER TABLE sysibm.sysdummy1 OWNER TO bichard;

--
-- Name: archive_log log_id; Type: DEFAULT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.archive_log ALTER COLUMN log_id SET DEFAULT nextval('br7own.archive_log_log_id_seq'::regclass);


--
-- Name: error_list error_id; Type: DEFAULT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.error_list ALTER COLUMN error_id SET DEFAULT nextval('br7own.error_list_error_id_seq'::regclass);


--
-- Name: error_list_notes note_id; Type: DEFAULT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.error_list_notes ALTER COLUMN note_id SET DEFAULT nextval('br7own.error_list_notes_note_id_seq'::regclass);


--
-- Name: error_list_triggers trigger_id; Type: DEFAULT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.error_list_triggers ALTER COLUMN trigger_id SET DEFAULT nextval('br7own.error_list_triggers_trigger_id_seq'::regclass);


--
-- Name: groups id; Type: DEFAULT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.groups ALTER COLUMN id SET DEFAULT nextval('br7own.groups_id_seq'::regclass);


--
-- Name: password_history id; Type: DEFAULT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.password_history ALTER COLUMN id SET DEFAULT nextval('br7own.password_history_id_seq'::regclass);


--
-- Name: pnc_event_sequence event_sequence_id; Type: DEFAULT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.pnc_event_sequence ALTER COLUMN event_sequence_id SET DEFAULT nextval('br7own.pnc_event_sequence_event_sequence_id_seq'::regclass);


--
-- Name: service_messages id; Type: DEFAULT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.service_messages ALTER COLUMN id SET DEFAULT nextval('br7own.service_messages_id_seq'::regclass);


--
-- Name: team team_id; Type: DEFAULT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.team ALTER COLUMN team_id SET DEFAULT nextval('br7own.team_team_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.users ALTER COLUMN id SET DEFAULT nextval('br7own.users_id_seq'::regclass);


--
-- Data for Name: archive_error_list; Type: TABLE DATA; Schema: br7own; Owner: bichard
--

COPY br7own.archive_error_list (error_id, message_id, phase, error_status, trigger_status, error_quality_checked, trigger_quality_checked, trigger_count, error_locked_by_id, trigger_locked_by_id, is_urgent, asn, court_code, annotated_msg, updated_msg, error_report, create_ts, error_reason, trigger_reason, error_count, user_updated_flag, court_date, ptiurn, court_name, resolution_ts, msg_received_ts, error_resolved_by, trigger_resolved_by, error_resolved_ts, trigger_resolved_ts, defendant_name, org_for_police_filter, court_room, court_reference, error_insert_ts, trigger_insert_ts, pnc_update_enabled, archive_log_id, audit_logged_at, audit_log_attempts) FROM stdin;
\.


--
-- Data for Name: archive_error_list_notes; Type: TABLE DATA; Schema: br7own; Owner: bichard
--

COPY br7own.archive_error_list_notes (note_id, error_id, note_text, user_id, create_ts) FROM stdin;
\.


--
-- Data for Name: archive_error_list_triggers; Type: TABLE DATA; Schema: br7own; Owner: bichard
--

COPY br7own.archive_error_list_triggers (trigger_id, error_id, trigger_code, trigger_item_identity, status, create_ts, resolved_by, resolved_ts) FROM stdin;
\.


--
-- Data for Name: archive_log; Type: TABLE DATA; Schema: br7own; Owner: bichard
--

COPY br7own.archive_log (log_id, archived_at, archived_by, audit_logged_at) FROM stdin;
\.


--
-- Data for Name: error_list; Type: TABLE DATA; Schema: br7own; Owner: bichard
--

COPY br7own.error_list (error_id, message_id, phase, error_status, trigger_status, error_quality_checked, trigger_quality_checked, trigger_count, error_locked_by_id, trigger_locked_by_id, is_urgent, asn, court_code, annotated_msg, updated_msg, error_report, create_ts, error_reason, trigger_reason, error_count, user_updated_flag, court_date, ptiurn, court_name, resolution_ts, msg_received_ts, error_resolved_by, trigger_resolved_by, error_resolved_ts, trigger_resolved_ts, defendant_name, org_for_police_filter, court_room, court_reference, error_insert_ts, trigger_insert_ts, pnc_update_enabled, last_pnc_failure_resubmission_ts, total_pnc_failure_resubmissions) FROM stdin;
\.


--
-- Data for Name: error_list_notes; Type: TABLE DATA; Schema: br7own; Owner: bichard
--

COPY br7own.error_list_notes (note_id, error_id, note_text, user_id, create_ts) FROM stdin;
\.


--
-- Data for Name: error_list_triggers; Type: TABLE DATA; Schema: br7own; Owner: bichard
--

COPY br7own.error_list_triggers (trigger_id, error_id, trigger_code, trigger_item_identity, status, create_ts, resolved_by, resolved_ts) FROM stdin;
\.


--
-- Data for Name: groups; Type: TABLE DATA; Schema: br7own; Owner: bichard
--

COPY br7own.groups (id, name, description, friendly_name, parent_id) FROM stdin;
9	B7SuperUserManager_grp	\N	Super User Manager	\N
8	B7AuditLoggingManager_grp	\N	Audit Logging Manager	9
7	B7UserManager_grp	\N	User Manager	9
2	B7Audit_grp	\N	Audit	7
5	B7Supervisor_grp	\N	Supervisor	7
1	B7Allocator_grp	\N	Allocator	5
4	B7GeneralHandler_grp	\N	General Handler	5
6	B7TriggerHandler_grp	\N	Trigger Handler	4
3	B7ExceptionHandler_grp	\N	Exception Handler	4
10	B7NewUI_grp	\N	New Bichard UI	0
\.


--
-- Data for Name: password_history; Type: TABLE DATA; Schema: br7own; Owner: bichard
--

COPY br7own.password_history (id, user_id, password_hash, last_used) FROM stdin;
\.


--
-- Data for Name: pnc_data_channel; Type: TABLE DATA; Schema: br7own; Owner: bichard
--

COPY br7own.pnc_data_channel (data_channel_id, force_number, nid, nid_range_start, nid_range_end, last_nid_reset, manual_nid_reset, last_event_sequence_reset, manual_event_sequence_reset, channel_taken) FROM stdin;
1	73	1	1	9999999	2023-03-13 17:07:19.616393	0	2023-03-13 17:07:19.616393	0	\N
\.


--
-- Data for Name: pnc_event_sequence; Type: TABLE DATA; Schema: br7own; Owner: bichard
--

COPY br7own.pnc_event_sequence (event_sequence_id, event_code, sequence_number, data_channel_id) FROM stdin;
1	SAPP	1	1
2	RDIS	1	1
3	GENL	1	1
4	ENQR	1	1
\.


--
-- Data for Name: service_messages; Type: TABLE DATA; Schema: br7own; Owner: bichard
--

COPY br7own.service_messages (id, message, created_at) FROM stdin;
\.


--
-- Data for Name: team; Type: TABLE DATA; Schema: br7own; Owner: bichard
--

COPY br7own.team (team_id, team_name, owner, area) FROM stdin;
\.


--
-- Data for Name: team_membership; Type: TABLE DATA; Schema: br7own; Owner: bichard
--

COPY br7own.team_membership (team_id, member) FROM stdin;
\.


--
-- Data for Name: team_supervision; Type: TABLE DATA; Schema: br7own; Owner: bichard
--

COPY br7own.team_supervision (supervisor, team_id) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: br7own; Owner: bichard
--

COPY br7own.users (id, username, exclusion_list, inclusion_list, created_at, endorsed_by, last_logged_in, org_serves, forenames, surname, email, password, last_login_attempt, email_verification_code, email_verification_generated, deleted_at, password_reset_code, migrated_password, jwt_id, jwt_generated_at, visible_courts, visible_forces, excluded_triggers, failed_password_attempts, feature_flags) FROM stdin;
23	marc.de-la-rue			2023-03-13 17:07:26.783212	Endorser Not found	\N	048C600	Marc	De La Rue	marc.delarue@justice.gov.uk		2020-01-01 00:00:00		2020-01-01 00:00:00	\N		{SSHA}H3TRHIARntPnV8z9uVxq+ykTRTu32Gux		\N	01,02,03,04,05,06,07,10,11,12,13,14,15,16,17,20,21,22,23,24,30,31,32,33,34,35,36,37,40,41,42,43,44,45,46,47,50,52,53,54,55,60,61,62,63,73,88,89,91,93	001,002,004,014,045		\N	{}
1	Bichard01		B01,B41ME00	2023-03-13 17:07:26.783212	Endorser Not found	\N	048C600	Bichard User	01	bichard01@example.com	$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw	2020-01-01 00:00:00		2020-01-01 00:00:00	\N		{SSHA}H3TRHIARntPnV8z9uVxq+ykTRTu32Gux		\N	B01,B41ME00	001,002,004,014,045		\N	"{\\"test_flag\\":true}"
2	Allocator1		B01,B41ME00	2023-03-13 17:07:26.783212	Endorser Not found	\N	048C600	Bichard User	01	allocator1@example.com	$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw	2020-01-01 00:00:00		2020-01-01 00:00:00	\N		{SSHA}H3TRHIARntPnV8z9uVxq+ykTRTu32Gux		\N	B01,B41ME00	001,002,004,014,045		\N	"{\\"test_flag\\":true}"
3	Audit1		B01,B41ME00	2023-03-13 17:07:26.783212	Endorser Not found	\N	048C600	Bichard User	01	audit1@example.com	$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw	2020-01-01 00:00:00		2020-01-01 00:00:00	\N		{SSHA}H3TRHIARntPnV8z9uVxq+ykTRTu32Gux		\N	B01,B41ME00	001,002,004,014,045		\N	"{\\"test_flag\\":true}"
4	ExceptionHandler1		B01,B41ME00	2023-03-13 17:07:26.783212	Endorser Not found	\N	048C600	Bichard User	01	exceptionhandler1@example.com	$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw	2020-01-01 00:00:00		2020-01-01 00:00:00	\N		{SSHA}H3TRHIARntPnV8z9uVxq+ykTRTu32Gux		\N	B01,B41ME00	001,002,004,014,045		\N	"{\\"test_flag\\":true}"
5	GeneralHandler1		B01,B41ME00	2023-03-13 17:07:26.783212	Endorser Not found	\N	048C600	Bichard User	01	generalhandler1@example.com	$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw	2020-01-01 00:00:00		2020-01-01 00:00:00	\N		{SSHA}H3TRHIARntPnV8z9uVxq+ykTRTu32Gux		\N	B01,B41ME00	001,002,004,014,045		\N	"{\\"test_flag\\":true}"
6	Supervisor1		B01,B41ME00	2023-03-13 17:07:26.783212	Endorser Not found	\N	048C600	Bichard User	01	supervisor1@example.com	$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw	2020-01-01 00:00:00		2020-01-01 00:00:00	\N		{SSHA}H3TRHIARntPnV8z9uVxq+ykTRTu32Gux		\N	B01,B41ME00	001,002,004,014,045		\N	"{\\"test_flag\\":true}"
7	TriggerHandler1		B01,B41ME00	2023-03-13 17:07:26.783212	Endorser Not found	\N	048C600	Bichard User	01	triggerhandler1@example.com	$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw	2020-01-01 00:00:00		2020-01-01 00:00:00	\N		{SSHA}H3TRHIARntPnV8z9uVxq+ykTRTu32Gux		\N	B01,B41ME00	001,002,004,014,045		\N	"{\\"test_flag\\":true}"
8	Allocator2		B40ME00	2023-03-13 17:07:26.783212	Endorser Not found	\N	048C600	Bichard User	01	allocator2@example.com	$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw	2020-01-01 00:00:00		2020-01-01 00:00:00	\N		{SSHA}H3TRHIARntPnV8z9uVxq+ykTRTu32Gux		\N	B40ME00	001,002,004,014,045		\N	"{\\"test_flag\\":true}"
9	Audit2		B40ME00	2023-03-13 17:07:26.783212	Endorser Not found	\N	048C600	Bichard User	01	audit2@example.com	$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw	2020-01-01 00:00:00		2020-01-01 00:00:00	\N		{SSHA}H3TRHIARntPnV8z9uVxq+ykTRTu32Gux		\N	B40ME00	001,002,004,014,045		\N	"{\\"test_flag\\":true}"
10	ExceptionHandler2		B40ME00	2023-03-13 17:07:26.783212	Endorser Not found	\N	048C600	Bichard User	01	exceptionhandler2@example.com	$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw	2020-01-01 00:00:00		2020-01-01 00:00:00	\N		{SSHA}H3TRHIARntPnV8z9uVxq+ykTRTu32Gux		\N	B40ME00	001,002,004,014,045		\N	"{\\"test_flag\\":true}"
11	GeneralHandler2		B40ME00	2023-03-13 17:07:26.783212	Endorser Not found	\N	048C600	Bichard User	01	generalhandler2@example.com	$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw	2020-01-01 00:00:00		2020-01-01 00:00:00	\N		{SSHA}H3TRHIARntPnV8z9uVxq+ykTRTu32Gux		\N	B40ME00	001,002,004,014,045		\N	"{\\"test_flag\\":true}"
12	Supervisor2		B40ME00	2023-03-13 17:07:26.783212	Endorser Not found	\N	048C600	Bichard User	01	supervisor2@example.com	$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw	2020-01-01 00:00:00		2020-01-01 00:00:00	\N		{SSHA}H3TRHIARntPnV8z9uVxq+ykTRTu32Gux		\N	B40ME00	001,002,004,014,045		\N	"{\\"test_flag\\":true}"
13	TriggerHandler2		B40ME00	2023-03-13 17:07:26.783212	Endorser Not found	\N	048C600	Bichard User	01	triggerhandler2@example.com	$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw	2020-01-01 00:00:00		2020-01-01 00:00:00	\N		{SSHA}H3TRHIARntPnV8z9uVxq+ykTRTu32Gux		\N	B40ME00	001,002,004,014,045		\N	"{\\"test_flag\\":true}"
14	NoGroupsAssigned		B40ME00	2023-03-13 17:07:26.783212	Endorser Not found	\N	048C600	Bichard User	01	nogroupsassigned@example.com	$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw	2020-01-01 00:00:00		2020-01-01 00:00:00	\N		{SSHA}H3TRHIARntPnV8z9uVxq+ykTRTu32Gux		\N	B40ME00	001,002,004,014,045		\N	"{\\"test_flag\\":true}"
15	ben.pirt		B01,B41ME00	2023-03-13 17:07:26.783212	Endorser Not found	\N	048C600	Ben	Pirt	ben.pirt@madetech.com		2020-01-01 00:00:00		2020-01-01 00:00:00	\N		{SSHA}H3TRHIARntPnV8z9uVxq+ykTRTu32Gux		\N	B01,B41ME00	001,002,004,014,045		\N	"{\\"test_flag\\":true}"
16	emad.karamad		B01,B41ME00	2023-03-13 17:07:26.783212	Endorser Not found	\N	048C600	Emad	Karamad	emad.karamad@madetech.com		2020-01-01 00:00:00		2020-01-01 00:00:00	\N		{SSHA}H3TRHIARntPnV8z9uVxq+ykTRTu32Gux		\N	B01,B41ME00	001,002,004,014,045		\N	"{\\"test_flag\\":true}"
17	jamie.davies		B01,B41ME00	2023-03-13 17:07:26.783212	Endorser Not found	\N	048C600	Jamie	Davies	jamie.davies@madetech.com		2020-01-01 00:00:00		2020-01-01 00:00:00	\N		{SSHA}H3TRHIARntPnV8z9uVxq+ykTRTu32Gux		\N	B01,B41ME00	001,002,004,014,045		\N	"{\\"test_flag\\":true}"
18	simon.oldham		B01,B41ME00	2023-03-13 17:07:26.783212	Endorser Not found	\N	048C600	Simon	Oldham	simon.oldham@madetech.com		2020-01-01 00:00:00		2020-01-01 00:00:00	\N		{SSHA}H3TRHIARntPnV8z9uVxq+ykTRTu32Gux		\N	B01,B41ME00	001,002,004,014,045		\N	"{\\"test_flag\\":true}"
19	alice.lee		B01,B41ME00	2023-03-13 17:07:26.783212	Endorser Not found	\N	048C600	Alice	Lee	alice.lee@madetech.com		2020-01-01 00:00:00		2020-01-01 00:00:00	\N		{SSHA}H3TRHIARntPnV8z9uVxq+ykTRTu32Gux		\N	B01,B41ME00	001,002,004,014,045		\N	"{\\"test_flag\\":true}"
20	csaba.gyorfi		B01,B41ME00	2023-03-13 17:07:26.783212	Endorser Not found	\N	048C600	Csaba	Gyorfi	csaba.gyorfi@madetech.com		2020-01-01 00:00:00		2020-01-01 00:00:00	\N		{SSHA}H3TRHIARntPnV8z9uVxq+ykTRTu32Gux		\N	B01,B41ME00	001,002,004,014,045		\N	"{\\"test_flag\\":true}"
21	jazz.sarkaria		B01,B41ME00	2023-03-13 17:07:26.783212	Endorser Not found	\N	048C600	Jazz	Sarkaria	jazz.sarkaria@madetech.com		2020-01-01 00:00:00		2020-01-01 00:00:00	\N		{SSHA}H3TRHIARntPnV8z9uVxq+ykTRTu32Gux		\N	B01,B41ME00	001,002,004,014,045		\N	"{\\"test_flag\\":true}"
22	tom.vaughan		B01,B41ME00	2023-03-13 17:07:26.783212	Endorser Not found	\N	048C600	Tom	Vaughan	tom.vaughan@madetech.com		2020-01-01 00:00:00		2020-01-01 00:00:00	\N		{SSHA}H3TRHIARntPnV8z9uVxq+ykTRTu32Gux		\N	B01,B41ME00	001,002,004,014,045		\N	"{\\"test_flag\\":true}"
24	heather.roberts		B01,B41ME00	2023-03-13 17:07:27.000512	Endorser Not found	\N	048C600	Heather	Roberts	heather.roberts@madetech.com	$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw	2020-01-01 00:00:00		2020-01-01 00:00:00	\N		{SSHA}H3TRHIARntPnV8z9uVxq+ykTRTu32Gux		\N	B01,B41ME00	001,002,004,014,045		\N	"{\\"test_flag\\":true}"
25	tolu.johnson		B01,B41ME00	2023-03-13 17:07:27.000512	Endorser Not found	\N	048C600	Tolu	Johnson	tolu.johnson@madetech.com	$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw	2020-01-01 00:00:00		2020-01-01 00:00:00	\N		{SSHA}H3TRHIARntPnV8z9uVxq+ykTRTu32Gux		\N	B01,B41ME00	001,002,004,014,045		\N	"{\\"test_flag\\":true}"
\.


--
-- Data for Name: users_groups; Type: TABLE DATA; Schema: br7own; Owner: bichard
--

COPY br7own.users_groups (user_id, group_id) FROM stdin;
1	1
2	1
8	1
15	1
16	1
17	1
18	1
19	1
20	1
21	1
22	1
1	2
3	2
9	2
15	2
16	2
17	2
18	2
19	2
20	2
21	2
22	2
1	3
5	3
11	3
15	3
16	3
17	3
18	3
19	3
20	3
21	3
22	3
1	5
6	5
12	5
15	5
16	5
17	5
18	5
19	5
20	5
21	5
22	5
23	5
1	6
7	6
13	6
15	6
16	6
17	6
18	6
19	6
20	6
21	6
22	6
15	7
16	7
17	7
18	7
19	7
20	7
21	7
22	7
15	8
16	8
17	8
18	8
19	8
20	8
21	8
22	8
15	9
16	9
17	9
18	9
19	9
20	9
21	9
22	9
24	1
25	1
24	2
25	2
24	3
25	3
24	5
25	5
24	6
25	6
24	7
25	7
24	8
25	8
24	9
25	9
15	10
16	10
17	10
18	10
19	10
20	10
21	10
22	10
24	10
\.


--
-- Data for Name: work_allocation_report; Type: TABLE DATA; Schema: br7own; Owner: bichard
--

COPY br7own.work_allocation_report (area_code, report, report_timestamp) FROM stdin;
\.


--
-- Data for Name: job; Type: TABLE DATA; Schema: cron; Owner: bichard
--

-- COPY cron.job (jobid, schedule, command, nodename, nodeport, database, username, active, jobname) FROM stdin;
-- 1	*/10 * * * *	SELECT br7own.archive_met_police_records(100)	localhost	5432	bichard	bichard	f	met_police_cleardown
-- 2	*/10 * * * *	SELECT br7own.archive_resolved_records(100)	localhost	5432	bichard	bichard	t	archive_resolved_records
-- \.


--
-- Data for Name: job_run_details; Type: TABLE DATA; Schema: cron; Owner: bichard
--

-- COPY cron.job_run_details (jobid, runid, job_pid, database, username, command, status, return_message, start_time, end_time) FROM stdin;
-- \.


--
-- Data for Name: databasechangelog; Type: TABLE DATA; Schema: public; Owner: bichard
--

COPY public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) FROM stdin;
001-schema	bjpirt	migrations/base/001_schema.sql	2023-03-13 17:07:19.371859	1	EXECUTED	8:c12762f242370c51e99e4ed228059ff6	sql		\N	4.20.0	\N	\N	8727239216
002-error-list	bjpirt	migrations/base/002_error_list.sql	2023-03-13 17:07:19.49591	2	EXECUTED	8:3405d0d22f4a55a8aa35e5c56d6ea530	sql		\N	4.20.0	\N	\N	8727239216
003-error-list-notes	bjpirt	migrations/base/003_error_list_notes.sql	2023-03-13 17:07:19.548404	3	EXECUTED	8:f9cc0f3a7db887eed2c5a28736821e65	sql		\N	4.20.0	\N	\N	8727239216
004-error-list-triggers	bjpirt	migrations/base/004_error_list_triggers.sql	2023-03-13 17:07:19.597887	4	EXECUTED	8:340335203ba601d1d75bd38e64c2cd4b	sql		\N	4.20.0	\N	\N	8727239216
005-pnc-data-channel	bjpirt	migrations/base/005_pnc_data_channel.sql	2023-03-13 17:07:19.665237	5	EXECUTED	8:144cbd0c5acb64d58f8cfdf4a727bc83	sql		\N	4.20.0	\N	\N	8727239216
006-pnc-event-sequence	bjpirt	migrations/base/006_pnc_event_sequence.sql	2023-03-13 17:07:19.701323	6	EXECUTED	8:757580f7eceaac6fb861d25dfa32ce8b	sql		\N	4.20.0	\N	\N	8727239216
007-team	bjpirt	migrations/base/007_team.sql	2023-03-13 17:07:19.743324	7	EXECUTED	8:6a1b9e2fc7c70a828b0001420e7f7d90	sql		\N	4.20.0	\N	\N	8727239216
008-team-membership	bjpirt	migrations/base/008_team_membership.sql	2023-03-13 17:07:19.798168	8	EXECUTED	8:a5f090890d5a0f0c613cbd9b07274e05	sql		\N	4.20.0	\N	\N	8727239216
009-team-supervision	bjpirt	migrations/base/009_team_supervision.sql	2023-03-13 17:07:19.842995	9	EXECUTED	8:b288b0fdb8f413a10ec10196b5a5d21a	sql		\N	4.20.0	\N	\N	8727239216
010-work-allocation-report	bjpirt	migrations/base/010_work_allocation_report.sql	2023-03-13 17:07:19.89015	10	EXECUTED	8:7700ecfc2c0dbf06d245fe4f306b5a0b	sql		\N	4.20.0	\N	\N	8727239216
011-groups	bjpirt	migrations/base/011_groups.sql	2023-03-13 17:07:19.953443	11	EXECUTED	8:ce02d2398cc45f7300634472347b600e	sql		\N	4.20.0	\N	\N	8727239216
012-users	bjpirt	migrations/base/012_users.sql	2023-03-13 17:07:19.992106	12	EXECUTED	8:8f564b8feaf86754b3e021e17683d556	sql		\N	4.20.0	\N	\N	8727239216
013-users-groups	bjpirt	migrations/base/013_users_groups.sql	2023-03-13 17:07:20.040692	13	EXECUTED	8:b4bfb1894870c1f95a10a3a3cd88bca7	sql		\N	4.20.0	\N	\N	8727239216
014-password-history	mihai	migrations/base/014_password_history.sql	2023-03-13 17:07:20.086073	14	EXECUTED	8:d79acaa678f5326042cad6ad32234c40	sql		\N	4.20.0	\N	\N	8727239216
015-service-messages	emad	migrations/base/015_service_messages.sql	2023-03-13 17:07:20.133889	15	EXECUTED	8:1c2659979f0a64c9469e1446e48bf2e7	sql		\N	4.20.0	\N	\N	8727239216
016-failed-password-attempts	mihai	migrations/base/016_failed_password_attempts.sql	2023-03-13 17:07:20.175459	16	EXECUTED	8:c3adb0c8d54033cfe418eb8862293929	sql		\N	4.20.0	\N	\N	8727239216
0117-update-inclusion-exclusion-to-be-nullable	mihai	migrations/base/017-update-inclusion-exclusion-to-be-nullable.sql	2023-03-13 17:07:20.209508	17	EXECUTED	8:289076e03b6cfcb209654d56dbd9d906	sql		\N	4.20.0	\N	\N	8727239216
018-add_archive_tables	bjpirt	migrations/base/018-add_archive_tables.sql	2023-03-13 17:07:20.310235	18	EXECUTED	8:a77286ab73f28cc8673965e88e7d7e42	sql		\N	4.20.0	\N	\N	8727239216
019-archive_met_cron	bjpirt	migrations/base/019-archive_met_cron.sql	2023-03-13 17:07:20.373779	19	EXECUTED	8:edfbf61bdca29b1f7404b4a36ebf5072	sql		\N	4.20.0	\N	\N	8727239216
020-group_friendly_name	sjblac	migrations/base/020_group_friendly_name.sql	2023-03-13 17:07:20.415776	20	EXECUTED	8:5d9700e7100eff48524935b4c9991d57	sql		\N	4.20.0	\N	\N	8727239216
021-add_group	mihai	migrations/base/021_add_made_tech_group.sql	2023-03-13 17:07:20.448399	21	EXECUTED	8:bbde01f20e6436c0dc497c1e735694f5	sql		\N	4.20.0	\N	\N	8727239216
022-update_met_cron	bjpirt	migrations/base/022-update_met_cron.sql	2023-03-13 17:07:20.487824	22	EXECUTED	8:253844e17233c6ee03aba8448517a7c6	sql		\N	4.20.0	\N	\N	8727239216
022_group_parent_inheritance	mihai	migrations/base/022_group_parent_inheritance.sql	2023-03-13 17:07:20.546531	23	EXECUTED	8:51545c0368f56015bce65de35b6ef9f4	sql		\N	4.20.0	\N	\N	8727239216
024_archive_resolved_records_cron.sql	mihai	migrations/base/024_archive_resolved_records_cron.sql	2023-03-13 17:07:20.572064	24	EXECUTED	8:0a6023c41737c1ea54af5f042333df3d	sql		\N	4.20.0	\N	\N	8727239216
025_urn_on_archive_resolved_records.sql	mihai	migrations/base/025_turn_on_archive_resolved_records.sql	2023-03-13 17:07:20.593023	25	EXECUTED	8:c92727a325d647bc6348d44885be4bf6	sql		\N	4.20.0	\N	\N	8727239216
026_error_archival_recording.sql	alice	migrations/base/026_error_archival_recording.sql	2023-03-13 17:07:20.65359	26	EXECUTED	8:c3fa5171d836e1c9e3c73eaf770c7df8	sql		\N	4.20.0	\N	\N	8727239216
027_add_new_ui_group.sql	emad	migrations/base/027_add_new_ui_group.sql	2023-03-13 17:07:20.684791	27	EXECUTED	8:037304e6490f9ba1c9eb6c971f49bb5b	sql		\N	4.20.0	\N	\N	8727239216
028_add_pnc_failure-resubmission_columns.sql	emad	migrations/base/028_add_pnc_failure-resubmission_columns.sql	2023-03-13 17:07:20.704952	28	EXECUTED	8:c8ff6e9e523fd551249ae8fdeb4ab195	sql		\N	4.20.0	\N	\N	8727239216
029_add_feature_flags.sql	tomv	migrations/base/029_add_feature_flags.sql	2023-03-13 17:07:20.747566	29	EXECUTED	8:b0cfc57f1a977468f83c4f188b4dc125	sql		\N	4.20.0	\N	\N	8727239216
archive_error_records	bjpirt	migrations/functions/archive_error_records.sql	2023-03-13 17:07:20.783155	30	EXECUTED	8:c898632581d39f7f5e0eb51a26c87921	sql		\N	4.20.0	\N	\N	8727239216
archive_met_police_records	bjpirt	migrations/functions/archive_met_police_records.sql	2023-03-13 17:07:20.822691	31	EXECUTED	8:b34dbf329f7c385d3161f18147bb2635	sql		\N	4.20.0	\N	\N	8727239216
archive_resolved_records	mihai	migrations/functions/archive_resolved_records.sql	2023-03-13 17:07:20.861773	32	EXECUTED	8:bf5e58d550220f6c291a79a373544744	sql		\N	4.20.0	\N	\N	8727239216
note_text	bjpirt	migrations/functions/note_text.sql	2023-03-13 17:07:20.902032	33	EXECUTED	8:064dfa2f9ec1bd8a8cbea41fc564a8af	sql		\N	4.20.0	\N	\N	8727239216
secondsdiff	bjpirt	migrations/functions/secondsdiff.sql	2023-03-13 17:07:20.934311	34	EXECUTED	8:b33811a91020c1ee69b58f3d7995200a	sql		\N	4.20.0	\N	\N	8727239216
startofnextday	bjpirt	migrations/functions/startofnextday.sql	2023-03-13 17:07:20.95923	35	EXECUTED	8:36dea737ffdade65532d9b64016876e2	sql		\N	4.20.0	\N	\N	8727239216
trigger_cd_status	bjpirt	migrations/functions/trigger_cd_status.sql	2023-03-13 17:07:21.011032	36	EXECUTED	8:e4ff86a4eb870966e4da726baa1b9dd0	sql		\N	4.20.0	\N	\N	8727239216
unres_triggers	bjpirt	migrations/functions/unres_triggers.sql	2023-03-13 17:07:21.066369	37	EXECUTED	8:f70d9f6d34dddd08bb40f1e55f63cf49	sql		\N	4.20.0	\N	\N	8727239216
001_staging_users.sql	bjpirt	seeds/base/001_staging_users.sql	2023-03-13 17:07:26.984447	38	EXECUTED	8:f052942e209d1fe70d691697716f8832	sql		\N	4.20.0	\N	\N	8727246728
raw	includeAll	seeds/base/002_staging_users.sql	2023-03-13 17:07:27.021113	39	EXECUTED	8:9dfeed4454a89d4985fc4d32ea120e24	sql		\N	4.20.0	\N	\N	8727246728
raw	includeAll	seeds/base/003_assign_ui_group_to_users.sql	2023-03-13 17:07:27.045869	40	EXECUTED	8:a00c129c21dc9880522b90fa54f6208d	sql		\N	4.20.0	\N	\N	8727246728
raw	includeAll	seeds/base/004_update_default_feature_flag_format.sql	2023-03-13 17:07:27.074906	41	EXECUTED	8:662e07382085c2fa9132f918b4babd25	sql		\N	4.20.0	\N	\N	8727246728
\.


--
-- Data for Name: databasechangeloglock; Type: TABLE DATA; Schema: public; Owner: bichard
--

COPY public.databasechangeloglock (id, locked, lockgranted, lockedby) FROM stdin;
1	f	\N	\N
\.


--
-- Name: archive_log_log_id_seq; Type: SEQUENCE SET; Schema: br7own; Owner: bichard
--

SELECT pg_catalog.setval('br7own.archive_log_log_id_seq', 1, false);


--
-- Name: error_list_error_id_seq; Type: SEQUENCE SET; Schema: br7own; Owner: bichard
--

SELECT pg_catalog.setval('br7own.error_list_error_id_seq', 1, false);


--
-- Name: error_list_notes_note_id_seq; Type: SEQUENCE SET; Schema: br7own; Owner: bichard
--

SELECT pg_catalog.setval('br7own.error_list_notes_note_id_seq', 1, false);


--
-- Name: error_list_triggers_trigger_id_seq; Type: SEQUENCE SET; Schema: br7own; Owner: bichard
--

SELECT pg_catalog.setval('br7own.error_list_triggers_trigger_id_seq', 1, false);


--
-- Name: groups_id_seq; Type: SEQUENCE SET; Schema: br7own; Owner: bichard
--

SELECT pg_catalog.setval('br7own.groups_id_seq', 10, true);


--
-- Name: password_history_id_seq; Type: SEQUENCE SET; Schema: br7own; Owner: bichard
--

SELECT pg_catalog.setval('br7own.password_history_id_seq', 1, false);


--
-- Name: pnc_event_sequence_event_sequence_id_seq; Type: SEQUENCE SET; Schema: br7own; Owner: bichard
--

SELECT pg_catalog.setval('br7own.pnc_event_sequence_event_sequence_id_seq', 4, true);


--
-- Name: service_messages_id_seq; Type: SEQUENCE SET; Schema: br7own; Owner: bichard
--

SELECT pg_catalog.setval('br7own.service_messages_id_seq', 1, false);


--
-- Name: team_team_id_seq; Type: SEQUENCE SET; Schema: br7own; Owner: bichard
--

SELECT pg_catalog.setval('br7own.team_team_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: br7own; Owner: bichard
--

SELECT pg_catalog.setval('br7own.users_id_seq', 25, true);


--
-- Name: jobid_seq; Type: SEQUENCE SET; Schema: cron; Owner: bichard
--

-- SELECT pg_catalog.setval('cron.jobid_seq', 2, true);


--
-- Name: runid_seq; Type: SEQUENCE SET; Schema: cron; Owner: bichard
--

-- SELECT pg_catalog.setval('cron.runid_seq', 1, false);


--
-- Name: archive_error_list archive_error_list_pkey; Type: CONSTRAINT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.archive_error_list
    ADD CONSTRAINT archive_error_list_pkey PRIMARY KEY (error_id);


--
-- Name: archive_log archive_log_pkey; Type: CONSTRAINT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.archive_log
    ADD CONSTRAINT archive_log_pkey PRIMARY KEY (log_id);


--
-- Name: error_list error_list_pkey; Type: CONSTRAINT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.error_list
    ADD CONSTRAINT error_list_pkey PRIMARY KEY (error_id);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: password_history password_history_pkey; Type: CONSTRAINT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.password_history
    ADD CONSTRAINT password_history_pkey PRIMARY KEY (id);


--
-- Name: pnc_data_channel pnc_data_channel_pkey; Type: CONSTRAINT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.pnc_data_channel
    ADD CONSTRAINT pnc_data_channel_pkey PRIMARY KEY (data_channel_id);


--
-- Name: pnc_event_sequence pnc_event_sequence_pkey; Type: CONSTRAINT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.pnc_event_sequence
    ADD CONSTRAINT pnc_event_sequence_pkey PRIMARY KEY (event_sequence_id);


--
-- Name: service_messages service_messages_pkey; Type: CONSTRAINT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.service_messages
    ADD CONSTRAINT service_messages_pkey PRIMARY KEY (id);


--
-- Name: team_membership team_membership_pkey; Type: CONSTRAINT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.team_membership
    ADD CONSTRAINT team_membership_pkey PRIMARY KEY (team_id, member);


--
-- Name: team team_pkey; Type: CONSTRAINT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.team
    ADD CONSTRAINT team_pkey PRIMARY KEY (team_id);


--
-- Name: team_supervision team_supervision_pkey; Type: CONSTRAINT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.team_supervision
    ADD CONSTRAINT team_supervision_pkey PRIMARY KEY (supervisor, team_id);


--
-- Name: users_groups users_groups_pkey; Type: CONSTRAINT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.users_groups
    ADD CONSTRAINT users_groups_pkey PRIMARY KEY (user_id, group_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: work_allocation_report work_allocation_report_pkey; Type: CONSTRAINT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.work_allocation_report
    ADD CONSTRAINT work_allocation_report_pkey PRIMARY KEY (area_code);


--
-- Name: databasechangeloglock databasechangeloglock_pkey; Type: CONSTRAINT; Schema: public; Owner: bichard
--

ALTER TABLE ONLY public.databasechangeloglock
    ADD CONSTRAINT databasechangeloglock_pkey PRIMARY KEY (id);


--
-- Name: archive_error_list_archive_log_id_idx; Type: INDEX; Schema: br7own; Owner: bichard
--

CREATE INDEX archive_error_list_archive_log_id_idx ON br7own.archive_error_list USING btree (archive_log_id);


--
-- Name: archive_log_archived_at_idx; Type: INDEX; Schema: br7own; Owner: bichard
--

CREATE INDEX archive_log_archived_at_idx ON br7own.archive_log USING btree (archived_at);


--
-- Name: archive_log_audit_logged_at_idx; Type: INDEX; Schema: br7own; Owner: bichard
--

CREATE INDEX archive_log_audit_logged_at_idx ON br7own.archive_log USING btree (audit_logged_at);


--
-- Name: err_locked_id_ix; Type: INDEX; Schema: br7own; Owner: bichard
--

CREATE INDEX err_locked_id_ix ON br7own.error_list USING btree (error_locked_by_id);


--
-- Name: err_lst_courtcd_ix; Type: INDEX; Schema: br7own; Owner: bichard
--

CREATE INDEX err_lst_courtcd_ix ON br7own.error_list USING btree (court_code);


--
-- Name: err_lst_crtname_ix; Type: INDEX; Schema: br7own; Owner: bichard
--

CREATE INDEX err_lst_crtname_ix ON br7own.error_list USING btree (court_name_upper);


--
-- Name: err_lst_defname_ix; Type: INDEX; Schema: br7own; Owner: bichard
--

CREATE INDEX err_lst_defname_ix ON br7own.error_list USING btree (defendant_name_upper);


--
-- Name: err_lst_notes_ix; Type: INDEX; Schema: br7own; Owner: bichard
--

CREATE INDEX err_lst_notes_ix ON br7own.error_list_notes USING btree (error_id);


--
-- Name: err_lst_orgpolf_ix; Type: INDEX; Schema: br7own; Owner: bichard
--

CREATE INDEX err_lst_orgpolf_ix ON br7own.error_list USING btree (org_for_police_filter);


--
-- Name: err_lst_trg_tce_ix; Type: INDEX; Schema: br7own; Owner: bichard
--

CREATE INDEX err_lst_trg_tce_ix ON br7own.error_list_triggers USING btree (trigger_code, error_id);


--
-- Name: err_lst_trgrs_ix; Type: INDEX; Schema: br7own; Owner: bichard
--

CREATE INDEX err_lst_trgrs_ix ON br7own.error_list_triggers USING btree (error_id);


--
-- Name: service_messages_created_at_idx; Type: INDEX; Schema: br7own; Owner: bichard
--

CREATE INDEX service_messages_created_at_idx ON br7own.service_messages USING btree (created_at);


--
-- Name: trg_locked_id_ix; Type: INDEX; Schema: br7own; Owner: bichard
--

CREATE INDEX trg_locked_id_ix ON br7own.error_list USING btree (trigger_locked_by_id);


--
-- Name: unique_message_id; Type: INDEX; Schema: br7own; Owner: bichard
--

CREATE UNIQUE INDEX unique_message_id ON br7own.error_list USING btree (message_id);


--
-- Name: unique_users_email_idx; Type: INDEX; Schema: br7own; Owner: bichard
--

CREATE UNIQUE INDEX unique_users_email_idx ON br7own.users USING btree (lower((email)::text));


--
-- Name: unique_users_username_idx; Type: INDEX; Schema: br7own; Owner: bichard
--

CREATE UNIQUE INDEX unique_users_username_idx ON br7own.users USING btree (lower((username)::text));


--
-- Name: archive_error_list archive_error_list_archive_log_id_fkey; Type: FK CONSTRAINT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.archive_error_list
    ADD CONSTRAINT archive_error_list_archive_log_id_fkey FOREIGN KEY (archive_log_id) REFERENCES br7own.archive_log(log_id) ON DELETE CASCADE;


--
-- Name: archive_error_list_notes archive_error_list_notes_error_id_fkey; Type: FK CONSTRAINT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.archive_error_list_notes
    ADD CONSTRAINT archive_error_list_notes_error_id_fkey FOREIGN KEY (error_id) REFERENCES br7own.archive_error_list(error_id) ON DELETE CASCADE;


--
-- Name: archive_error_list_triggers archive_error_list_triggers_error_id_fkey; Type: FK CONSTRAINT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.archive_error_list_triggers
    ADD CONSTRAINT archive_error_list_triggers_error_id_fkey FOREIGN KEY (error_id) REFERENCES br7own.archive_error_list(error_id) ON DELETE CASCADE;


--
-- Name: error_list_notes error_list_notes_error_id_fkey; Type: FK CONSTRAINT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.error_list_notes
    ADD CONSTRAINT error_list_notes_error_id_fkey FOREIGN KEY (error_id) REFERENCES br7own.error_list(error_id) ON DELETE CASCADE;


--
-- Name: error_list_triggers error_list_triggers_error_id_fkey; Type: FK CONSTRAINT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.error_list_triggers
    ADD CONSTRAINT error_list_triggers_error_id_fkey FOREIGN KEY (error_id) REFERENCES br7own.error_list(error_id) ON DELETE CASCADE;


--
-- Name: password_history fk_password_history_user_id; Type: FK CONSTRAINT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.password_history
    ADD CONSTRAINT fk_password_history_user_id FOREIGN KEY (user_id) REFERENCES br7own.users(id) ON DELETE CASCADE;


--
-- Name: pnc_event_sequence pnc_event_sequence_data_channel_id_fkey; Type: FK CONSTRAINT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.pnc_event_sequence
    ADD CONSTRAINT pnc_event_sequence_data_channel_id_fkey FOREIGN KEY (data_channel_id) REFERENCES br7own.pnc_data_channel(data_channel_id) ON DELETE CASCADE;


--
-- Name: team_membership team_membership_team_id_fkey; Type: FK CONSTRAINT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.team_membership
    ADD CONSTRAINT team_membership_team_id_fkey FOREIGN KEY (team_id) REFERENCES br7own.team(team_id) ON DELETE CASCADE;


--
-- Name: team_supervision team_supervision_team_id_fkey; Type: FK CONSTRAINT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.team_supervision
    ADD CONSTRAINT team_supervision_team_id_fkey FOREIGN KEY (team_id) REFERENCES br7own.team(team_id) ON DELETE CASCADE;


--
-- Name: users_groups users_groups_group_id_fkey; Type: FK CONSTRAINT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.users_groups
    ADD CONSTRAINT users_groups_group_id_fkey FOREIGN KEY (group_id) REFERENCES br7own.groups(id);


--
-- Name: users_groups users_groups_user_id_fkey; Type: FK CONSTRAINT; Schema: br7own; Owner: bichard
--

ALTER TABLE ONLY br7own.users_groups
    ADD CONSTRAINT users_groups_user_id_fkey FOREIGN KEY (user_id) REFERENCES br7own.users(id);


--
-- Name: job cron_job_policy; Type: POLICY; Schema: cron; Owner: bichard
--

-- CREATE POLICY cron_job_policy ON cron.job USING ((username = CURRENT_USER));


--
-- Name: job_run_details cron_job_run_details_policy; Type: POLICY; Schema: cron; Owner: bichard
--

-- CREATE POLICY cron_job_run_details_policy ON cron.job_run_details USING ((username = CURRENT_USER));


--
-- Name: job; Type: ROW SECURITY; Schema: cron; Owner: bichard
--

-- ALTER TABLE cron.job ENABLE ROW LEVEL SECURITY;

--
-- Name: job_run_details; Type: ROW SECURITY; Schema: cron; Owner: bichard
--

-- ALTER TABLE cron.job_run_details ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA sysibm; Type: ACL; Schema: -; Owner: bichard
--

GRANT USAGE ON SCHEMA sysibm TO PUBLIC;


--
-- Name: TABLE sysdummy1; Type: ACL; Schema: sysibm; Owner: bichard
--

GRANT SELECT,REFERENCES ON TABLE sysibm.sysdummy1 TO PUBLIC;


--
-- PostgreSQL database dump complete
--

CREATE DATABASE conductor;
CREATE USER conductor WITH ENCRYPTED PASSWORD 'conductor';
GRANT ALL PRIVILEGES ON DATABASE conductor TO conductor;
