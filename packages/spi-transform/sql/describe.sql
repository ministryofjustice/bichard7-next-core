.mode csv
.output ./sql/output_describe.csv

DESCRIBE SELECT *
FROM delta_scan('s3://joe-u-delta-table-test/spi_messages/')
;