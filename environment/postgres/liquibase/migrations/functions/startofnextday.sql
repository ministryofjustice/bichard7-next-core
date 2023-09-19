--liquibase formatted sql
--changeset bjpirt:startofnextday runOnChange:true splitStatements:false

-- Returns the timestamp which is midnight 1 day after the given timestamp
CREATE OR REPLACE FUNCTION BR7OWN.STARTOFNEXTDAY(T1 TIMESTAMP) RETURNS TIMESTAMP AS $$
    BEGIN
        RETURN cast((cast(T1 as date) + interval '1 day') as timestamp);
    END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION BR7OWN.STARTOFNEXTDAY(T1 TIMESTAMP WITH TIME ZONE) RETURNS TIMESTAMP AS $$
    BEGIN
        RETURN cast((cast(T1 as date) + interval '1 day') as timestamp);
    END;
$$ LANGUAGE plpgsql;
