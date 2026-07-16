from datetime import datetime, timedelta
import json
import logging
from typing import Dict, Tuple
import boto3

# pyarrow used to keep dependencies light (as opposed to pandas/polars/duckdb)
import pyarrow as pa
import pyarrow.parquet as pq
import pyarrow.compute as pc
from pyarrow.lib import ArrowInvalid

logger = logging.getLogger()
logger.setLevel(logging.INFO)

BUCKET_NAME = "bichard-7-demo-status-page"
TABLE_OUTPUT_PREFIX = "data_tables/"
JSON_OUTPUT_PREFIX = "_data/"
NAMESPACE = "AWS/ECS"
METRIC_NAME = "CPUUtilization"
CLUSTER_NAME = "cjse-bichard7-leds-base-infra"
SERVICE_NAME = "cjse-bichard7-leds-base-infra-web"
DEFAULT_BACKFILL_DAYS = 1
GRANULARITY = 60
PA_SCHEMA = pa.schema([
    ('timestamp', pa.timestamp(unit='s')),
    ('value', pa.float32()),
    ('insert_timestamp', pa.timestamp(unit='s')) 
])

table_output_path = "s3://" + BUCKET_NAME + "/" + TABLE_OUTPUT_PREFIX + METRIC_NAME + "_" + CLUSTER_NAME + ".parquet"
json_output_key = JSON_OUTPUT_PREFIX + "ui_data.json"


def fetch_cloudwatch_metrics(
    namespace: str,
    metric_name: str,
    cluster_name: str,
    service_name: str,
    start_time: datetime,
    end_time: datetime,
    granularity_seconds: int = 60*60,
    statistic: str = "Average"
) -> pa.Table:
    """Queries CloudWatch for a specific metric over a historical window
    """
    cw_client = boto3.client("cloudwatch")

    # Build the metric data query configuration
    metric_data_queries = [
        {
            "Id": "m1",  # A unique identifier for this metric query (lowercase/numbers)
            "MetricStat": {
                "Metric": {
                    "Namespace": namespace,
                    "MetricName": metric_name,
                    "Dimensions": [
                        {"Name": "ClusterName", "Value": cluster_name},
                        {"Name": "ServiceName", "Value": service_name}
                    ],
                },
                "Period": granularity_seconds,  # Granularity of the data points (e.g., 300 = 5 minutes)
                "Stat": statistic,  # Can be Average, Sum, SampleCount, Maximum, Minimum
            },
            "ReturnData": True,
        }
    ]

    try:
        response = cw_client.get_metric_data(
            MetricDataQueries=metric_data_queries,
            StartTime=start_time,
            EndTime=end_time,
            ScanBy="TimestampAscending",  # Ensures chronological order
        )

        results = response.get("MetricDataResults", [])
        if not results or not results[0]["Timestamps"]:
            logger.info(f"No metric data found for {metric_name}")
            return pa.table()

        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        timestamp_array = pa.repeat(pa.scalar(current_time), len(results[0]["Timestamps"]))

        table = pa.table({
            "timestamp": results[0]["Timestamps"],
            "value": results[0]["Values"],
            "insert_timestamp": timestamp_array
        }, schema=PA_SCHEMA)

        return table

    except Exception as e:
        logger.info(f"Error fetching metrics from CloudWatch: {e}")
        raise


def get_last_row(table:pa.Table) -> Dict:
    return table.slice(table.num_rows - 1, 1).to_pydict()


def get_last_timestamp_from_parquet(path:str) -> datetime:
    default = datetime.now() - timedelta(days=DEFAULT_BACKFILL_DAYS)

    try:
        file = pq.ParquetFile(path)
    except (FileNotFoundError, OSError, ArrowInvalid) as e:
        logger.info(f"Returning default last timestamp from parquet. File doesn't exist in S3, or the path is invalid '{path}'")
        logger.info(e)
        return default

    table = file.read(columns=['timestamp'])
    if len(table) > 0:
        return pc.max(table['timestamp']).as_py()
    else:
        logger.info(f"Returning default last timestamp from parquet. 0 columns found in '{file}'")
        return default

    
def append_new_data_to_parquet(path: str, new_table: pa.Table) -> None:
    """
    Appends new data to an existing S3 parquet file by reading,
    concatenating, and overwriting it. 
    
    :param path: S3 URL string (e.g., 's3://bucket/file.parquet')
    :param new_table: A pyarrow.Table containing the new hourly data
    """
    try:
        existing_table = pq.read_table(path, schema=PA_SCHEMA)
        # (PyArrow will enforce that schemas match exactly)
        combined_table = pa.concat_tables([existing_table, new_table])
        
    except (FileNotFoundError, OSError) as e:
        # First run scenario: File doesn't exist, so the new table is the dataset
        logger.info(f"Skipping append, witing data from this run only. File not found or issue reading '{path}'")
        logger.info(e)
        combined_table = new_table

    # 3. Overwrite the file in S3 with the updated table
    pq.write_table(combined_table, path, compression='SNAPPY')


def lambda_handler(event, context) -> None:
    main()


def main() -> None:
    start_time = get_last_timestamp_from_parquet(table_output_path)
    end_time = datetime.now()
    logger.info(f"{start_time=}")
    logger.info(f"{end_time=}")

    metrics = fetch_cloudwatch_metrics(
        namespace=NAMESPACE,
        metric_name=METRIC_NAME,
        cluster_name=CLUSTER_NAME,
        service_name=SERVICE_NAME,
        start_time=start_time + timedelta(seconds=GRANULARITY),
        end_time=datetime.now(),
        granularity_seconds=GRANULARITY
    )

    # print("---head---")
    # print(metrics.slice(0, 10))
    # print("---tail---")
    # print(metrics.slice(max(metrics.num_rows - 10, 0)))


    if not metrics.num_rows == 0:
        # read-append-overwrite method used due to assumed small file size (2 cols, low granularity data, data retention period)
        # this avoids many small files problem if a new file got written on each pipeline run
        append_new_data_to_parquet(table_output_path, metrics)

        last_row = get_last_row(metrics)
        # cloudwatch labels the data with the start of the time window (e.g. average cpu usage 07:00-08:00 has a timestamp of 07:00)
        # so add the time window on to get the end of the most recent data point window
        last_updated = last_row["timestamp"][0] + timedelta(seconds=GRANULARITY)
        ui_data = {
            "lastUpdated": last_updated.strftime("%Y-%m-%d %H:%M:%S"),
            "cpuUsage": f"{last_row["value"][0]:.2f}%"
        }

        # json file overwritten on each run
        s3 = boto3.client('s3')
        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=json_output_key,
            Body=json.dumps(ui_data),
            ContentType='application/json'
        )
    


if __name__ == "__main__":
    main()