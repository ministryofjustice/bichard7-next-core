--liquibase formatted sql
--changeset bjpirt:001-schema

CREATE SCHEMA br7own;
GRANT ALL ON SCHEMA br7own TO bichard;

-- Temporary fix for cross-compatibility with DB2
CREATE SCHEMA sysibm;
GRANT USAGE ON SCHEMA sysibm TO PUBLIC;
CREATE VIEW sysibm.sysdummy1 AS SELECT 'X'::char(1) AS ibmreqd;
REVOKE ALL ON sysibm.sysdummy1 FROM PUBLIC;
GRANT SELECT, REFERENCES ON sysibm.sysdummy1 TO PUBLIC;