--liquibase formatted sql
--changeset bjpirt:trigger_cd_status runOnChange:true splitStatements:false

-- Returns a delimited list of triggers for a case in the specified resolution status.
CREATE OR REPLACE FUNCTION BR7OWN.TRIGGER_CD_STATUS(ERR_ID INTEGER, RES_STATUS INTEGER) RETURNS VARCHAR(450) AS $$
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
$$ LANGUAGE plpgsql;
