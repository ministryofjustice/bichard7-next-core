--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2 (Debian 14.2-1.pgdg110+1)
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

-- CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA public;


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
