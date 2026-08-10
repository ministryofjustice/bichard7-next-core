-- ad hoc query to answer NPCC questions around the Sentancing Act

.mode csv
.output ./sql/output.csv


SELECT DATE_TRUNC('month', _message_received_datetime::DATE) as month, left(Case_PTIURN, 2) as force_id, Case_Defendant_Offence_Result_ResultCode,  COUNT(DISTINCT _file_uuid)
FROM delta_scan('s3://joe-u-delta-table-test/spi_messages/') 
GROUP BY DATE_TRUNC('month', _message_received_datetime::DATE), left(Case_PTIURN, 2), Case_Defendant_Offence_Result_ResultCode
HAVING Case_Defendant_Offence_Result_ResultCode in (1032,1116,1030,4575,4576,4577,1507,1508,1115,1134)
ORDER BY left(Case_PTIURN, 2)
;