--liquibase formatted sql
--changeset bjpirt:note_text runOnChange:true splitStatements:false

-- Returns the most recent user entered note for for an error ID
CREATE OR REPLACE FUNCTION BR7OWN.NOTE_TEXT(ERR_ID INTEGER) RETURNS varchar(1034) AS $$
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
$$ LANGUAGE plpgsql;