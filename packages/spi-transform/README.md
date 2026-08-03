# SPI_TRANSFORM

Transforms SPIResults xml messages and writes to a deltalake table

## Querying data

### Local

Data can be queried locally using duckdb:

1. Navigate to the spi-transform directory in you terminal and run `make query-delta`

You can overwrite environment variables if needed e.g. `make query-delta VAULT_PROFILE=qsolution-production AWS_ACCOUNT_ID=x`

2. You will now be in a duckdb interactive shell. Type an sql query ending in a semi-colon and hit enter to see the results (type `.last` and use the arrow keys if needed to paginate). An example query is below:

```sql
SELECT COUNT(DISTINCT _file_uuid)
FROM delta_scan('s3://joe-u-delta-table-test/spi_messages/')
WHERE Case_Defendant_Offence_Result_ResultCode = '1116';

```

3. `ctrl+D` to exit the shell

### Athena

Data can be queried on an ad hoc basis using AWS Athena, which natively supports delta lake tables. This is charged per unit of data scanned. As the table is partitioned by the _message_received_date column, using a WHERE condition on this column will help to control the amount of data scanned due to predicate pushdown.
