import logging
from datetime import datetime, timedelta
from typing import Any, List

import boto3

# pyarrow used to keep dependencies light (as opposed to pandas/polars/duckdb)
import pyarrow as pa
import pyarrow.parquet as pq
from common import (
    BUCKET_NAME,
    DEFAULT_BACKFILL_DAYS,
    GRANULARITY_SECONDS,
    METRICS_CONFIG,
    PA_SCHEMA,
    TABLE_OUTPUT_PREFIX,
    get_last_row_from_table,
    read_parquet,
)

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def build_metric_data_query(
    output_filename: str,
    namespace: str,
    metric_name: str,
    granularity_seconds: int,
    statistic: str = "Average",
    cluster_name: str | None = None,
    service_name: str | None = None,
    load_balancer: str | None = None,
    queue_name: str | None = None,
) -> dict[str, Any]:
    dimensions: list[dict[str, str]] = []

    if cluster_name:
        dimensions.append({"Name": "ClusterName", "Value": cluster_name})
    if service_name:
        dimensions.append({"Name": "ServiceName", "Value": service_name})
    if load_balancer:
        dimensions.append({"Name": "LoadBalancer", "Value": load_balancer})
    if queue_name:
        dimensions.append({"Name": "QueueName", "Value": queue_name})

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


def cloudwatch_export() -> None:
    for config in METRICS_CONFIG:
        table_output_path = f"s3://{BUCKET_NAME}/{TABLE_OUTPUT_PREFIX}{config['output_filename']}.parquet"

        table = read_parquet(table_output_path, ["timestamp"])
        if table:
            last_row = get_last_row_from_table(table_output_path)
            start_time = last_row["timestamp"]
        else:
            start_time = datetime.now() - timedelta(days=DEFAULT_BACKFILL_DAYS)

        end_time = datetime.now()
        logger.info(f"{start_time=}")
        logger.info(f"{end_time=}")

        config["granularity_seconds"] = GRANULARITY_SECONDS
        metric_data_query = build_metric_data_query(**config)

        logger.info(f"Obtaining metrics for {config['output_filename']}...")
        metrics = fetch_cloudwatch_metrics(
            metric_data_queries=[metric_data_query],
            start_time=start_time + timedelta(seconds=GRANULARITY_SECONDS),
            end_time=end_time,
        )
        if not metrics:
            logger.info(
                f"No metrics found for {config['output_filename']}, skipping this metric without writing to s3."
            )
            continue

        if metrics[config["output_filename"]].num_rows == 0:
            logger.info(
                f"No metrics found for {config['output_filename']}, skipping this metric without writing to s3."
            )
            continue

        # read-append-overwrite method used due to assumed small file size (2 cols, low granularity data, data retention period)
        # this avoids many small files problem if a new file got written on each pipeline run
        append_new_data_to_parquet(
            table_output_path, metrics[config["output_filename"]]
        )
        logger.info(
            f"Metrics for {config['output_filename']} written to '{table_output_path}'."
        )


if __name__ == "__main__":
    cloudwatch_export()
