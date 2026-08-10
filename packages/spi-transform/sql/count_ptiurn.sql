-- ad hoc query to validate the delta table against the audit log

.mode csv
.output ./sql/output_ptiurn.csv

SELECT COUNT(DISTINCT Case_PTIURN)
FROM delta_scan('s3://joe-u-delta-table-test/spi_messages/') 
;