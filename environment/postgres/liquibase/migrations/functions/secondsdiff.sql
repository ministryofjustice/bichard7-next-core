--liquibase formatted sql
--changeset bjpirt:secondsdiff runOnChange:true splitStatements:false

-- Returns the number of seconds between 2 timestamps
CREATE OR REPLACE FUNCTION BR7OWN.SECONDSDIFF(T1 TIMESTAMP, T2 TIMESTAMP) RETURNS integer AS $$
    BEGIN
        RETURN EXTRACT(EPOCH FROM T1) - EXTRACT(EPOCH FROM T2);
    END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION BR7OWN.SECONDSDIFF(T1 TIMESTAMP WITH TIME ZONE, T2 TIMESTAMP WITH TIME ZONE) RETURNS integer AS $$
    BEGIN
        RETURN EXTRACT(EPOCH FROM T1) - EXTRACT(EPOCH FROM T2);
    END;
$$ LANGUAGE plpgsql;
