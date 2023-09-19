--liquibase formatted sql
--changeset bjpirt:010-work-allocation-report

------------------------------------------------
-- DDL Statements for table BR7OWN.WORK_ALLOCATION_REPORT
------------------------------------------------
CREATE TABLE br7own.WORK_ALLOCATION_REPORT  (
		  AREA_CODE VARCHAR(2) NOT NULL PRIMARY KEY,
		  REPORT BYTEA NOT NULL,
		  REPORT_TIMESTAMP TIMESTAMP NOT NULL);
