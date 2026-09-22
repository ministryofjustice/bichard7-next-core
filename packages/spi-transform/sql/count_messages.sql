-- ad hoc query to validate the delta table against the audit log

.mode csv
.output ./sql/output_messages.csv

SELECT DATE_TRUNC('month', _message_received_date::DATE) as month, COUNT(DISTINCT _file_uuid)
FROM delta_scan('s3://joe-u-delta-table-test/spi_messages/')
GROUP BY month
;
