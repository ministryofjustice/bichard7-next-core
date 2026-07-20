import json
import logging
from datetime import datetime, timedelta
from typing import Any, List
from zoneinfo import ZoneInfo

import boto3

# pyarrow used to keep dependencies light (as opposed to pandas/polars/duckdb)
import pyarrow as pa
import pyarrow.compute as pc
import pyarrow.parquet as pq
from pyarrow.lib import ArrowInvalid

logger = logging.getLogger()
logger.setLevel(logging.INFO)


BUCKET_NAME = "bichard-7-demo-status-page"
TABLE_OUTPUT_PREFIX = "data_tables/"
JSON_OUTPUT_KEY = "_data/ui_data.json"
DEFAULT_BACKFILL_DAYS = 1
GRANULARITY = 60
METRICS_CONFIG: List[dict[str, Any]] = [
    {
        "output_filename": "base_infra_ecs_cluster_cpu_utilisation",  # alphanumeric and underscores only
        "namespace": "AWS/ECS",
        "metric_name": "CPUUtilization",
        "cluster_name": "cjse-bichard7-leds-base-infra",
        "service_name": "cjse-bichard7-leds-base-infra-web",
    },
    {
        "output_filename": "conductor_elb_active_connection_count",
        "namespace": "AWS/ApplicationELB",
        "metric_name": "ActiveConnectionCount",
        "load_balancer": "app/cjse-uat-bichard-7-conductor/3c3aa9f65bfe9489",
    },
]
PA_SCHEMA = pa.schema(
    [
        ("timestamp", pa.timestamp(unit="s")),
        ("value", pa.float32()),
        ("insert_timestamp", pa.timestamp(unit="s")),
    ]
)


def build_metric_data_query(
    output_filename: str,
    namespace: str,
    metric_name: str,
    granularity_seconds: int,
    statistic: str = "Average",
    cluster_name: str | None = None,
    service_name: str | None = None,
    load_balancer: str | None = None,
) -> dict[str, Any]:
    dimensions: list[dict[str, str]] = []

    if cluster_name:
        dimensions.append({"Name": "ClusterName", "Value": cluster_name})
    if service_name:
        dimensions.append({"Name": "ServiceName", "Value": service_name})
    if load_balancer:
        dimensions.append({"Name": "LoadBalancer", "Value": load_balancer})

    return {
        "Id": output_filename,  # A unique identifier for this metric query (lowercase/numbers)
        "MetricStat": {
            "Metric": {
                "Namespace": namespace,
                "MetricName": metric_name,
                "Dimensions": dimensions,
            },
            "Period": granularity_seconds,  # Granularity of the data points (e.g., 300 = 5 minutes)
            "Stat": statistic,  # Can be Average, Sum, SampleCount, Maximum, Minimum
        },
        "ReturnData": True,
    }


def fetch_cloudwatch_metrics(
    metric_data_queries: List[dict],
    start_time: datetime,
    end_time: datetime,
) -> dict[str, pa.Table]:
    """Queries CloudWatch for specific metrics over a historical window"""
    cw_client = boto3.client("cloudwatch")

    try:
        response = cw_client.get_metric_data(
            MetricDataQueries=metric_data_queries,
            StartTime=start_time,
            EndTime=end_time,
            ScanBy="TimestampAscending",  # Ensures chronological order
        )

        results = response.get("MetricDataResults", None)
        if not results:
            logger.info("No metric data found for any metric.")
            return {}

        tables_dict = {}
        for result in results:
            if not result["Timestamps"]:
                logger.info(f"No metric data found for {result.get('Id')}.")
                return {}

            current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            timestamp_array = pa.repeat(
                pa.scalar(current_time), len(result["Timestamps"])
            )

            tables_dict[result["Id"]] = pa.table(
                {
                    "timestamp": result["Timestamps"],
                    "value": result["Values"],
                    "insert_timestamp": timestamp_array,
                },
                schema=PA_SCHEMA,
            )

        logger.info(f"{len(result['Timestamps'])} data points returned.")
        return tables_dict

    except Exception as e:
        logger.info(f"Error fetching metrics from CloudWatch: {e}")
        raise


def get_last_row(table: pa.Table) -> dict:
    return table.slice(table.num_rows - 1, 1).to_pydict()


def get_last_timestamp_from_parquet(path: str) -> datetime:
    default = datetime.now() - timedelta(days=DEFAULT_BACKFILL_DAYS)

    try:
        file = pq.ParquetFile(path)
    except (FileNotFoundError, OSError, ArrowInvalid) as e:
        logger.info(
            f"Returning default last timestamp from parquet. File doesn't exist in S3, or the path is invalid '{path}'"
        )
        logger.info(e)
        return default

    table = file.read(columns=["timestamp"])
    if len(table) > 0:
        return pc.max(table["timestamp"]).as_py()  # type: ignore
    else:
        logger.info(
            f"Returning default last timestamp from parquet. 0 columns found in '{file}'"
        )
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
        logger.info(
            f"Skipping append, witing data from this run only. File not found or issue reading '{path}'"
        )
        logger.info(e)
        combined_table = new_table

    # 3. Overwrite the file in S3 with the updated table
    pq.write_table(combined_table, path, compression="SNAPPY")


def convert_utc_to_uk(utc_time):
    uk_tz = ZoneInfo("Europe/London")
    if utc_time.tzinfo is None:
        utc_time = utc_time.replace(tzinfo=ZoneInfo("UTC"))
    return utc_time.astimezone(uk_tz)


def lambda_handler(event, context) -> None:
    main()


def main() -> None:
    last_updated = []
    ui_data = {}
    for config in METRICS_CONFIG:
        table_output_path = f"s3://{BUCKET_NAME}/{TABLE_OUTPUT_PREFIX}{config['output_filename']}.parquet"

        start_time = get_last_timestamp_from_parquet(table_output_path)
        end_time = datetime.now()
        logger.info(f"{start_time=}")
        logger.info(f"{end_time=}")

        config["granularity_seconds"] = GRANULARITY
        metric_data_query = build_metric_data_query(**config)
        logger.info(f"Obtaining metrics for {config['output_filename']}...")
        metrics = fetch_cloudwatch_metrics(
            metric_data_queries=[metric_data_query],
            start_time=start_time + timedelta(seconds=GRANULARITY),
            end_time=datetime.now(),
        )
        if not metrics:
            logger.info("No metrics found, terminating without writing to s3.")
            return

        if not metrics[config["output_filename"]].num_rows == 0:
            # read-append-overwrite method used due to assumed small file size (2 cols, low granularity data, data retention period)
            # this avoids many small files problem if a new file got written on each pipeline run
            append_new_data_to_parquet(
                table_output_path, metrics[config["output_filename"]]
            )
            logger.info(
                f"Metrics for {config['output_filename']} written to '{table_output_path}'."
            )

            last_row = get_last_row(metrics[config["output_filename"]])
            timestamp_uk = convert_utc_to_uk(last_row["timestamp"][0])

            # cloudwatch labels the data with the start of the time window (e.g. average cpu usage 07:00-08:00 has a timestamp of 07:00)
            # so add the time window on to get the end of the most recent data point window
            last_updated.append(timestamp_uk + timedelta(seconds=GRANULARITY))
            ui_data[config["output_filename"]] = f"{last_row['value'][0]:.2f}%"

    ui_data["lastUpdated"] = max(last_updated).strftime("%Y-%m-%d %H:%M:%S")
    s3 = boto3.client("s3")
    # json file overwritten on each run
    s3.put_object(
        Bucket=BUCKET_NAME,
        Key=JSON_OUTPUT_KEY,
        Body=json.dumps(ui_data),
        ContentType="application/json",
    )
    logger.info(f"ui data updated: {BUCKET_NAME=}, {JSON_OUTPUT_KEY=}")


if __name__ == "__main__":
    main()
