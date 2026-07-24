import json
import logging
import os
from datetime import timedelta
from typing import Any
from zoneinfo import ZoneInfo

import boto3
import duckdb
from common import (
    BUCKET_NAME,
    GRANULARITY_SECONDS,
    JSON_OUTPUT_KEY,
    METRICS_CONFIG,
    get_last_rows_from_table,
    get_parquet_file_path,
    read_parquet,
)

logger = logging.getLogger()
logger.setLevel(logging.INFO)

task_root = os.environ.get("LAMBDA_TASK_ROOT", "/var/task")


def query_duckdb(sql: str):
    con = duckdb.connect()
    # Point DuckDB to the pre-installed extension path (see dockerfile)
    con.execute(f"SET extension_directory='{task_root}/.duckdb/extensions'")
    con.execute("LOAD httpfs;")

    return con.execute(sql).fetchall()


def convert_utc_to_uk(utc_time):
    uk_tz = ZoneInfo("Europe/London")
    if utc_time.tzinfo is None:
        utc_time = utc_time.replace(tzinfo=ZoneInfo("UTC"))
    return utc_time.astimezone(uk_tz)


def get_last_updated(
    metrics_config: list[dict[str, Any]], timestamp_column: str = "timestamp"
) -> str | None:
    metric_last_updated = []
    for config in metrics_config:
        parquet_path = get_parquet_file_path(config["output_filename"])
        table = read_parquet(parquet_path, columns=[timestamp_column])
        if table:
            last_row = get_last_rows_from_table(table)
            # cloudwatch labels the data with the start of the time window (e.g. average cpu usage 07:00-08:00 has a timestamp of 07:00)
            # so add the time window on to get the end of the most recent data point window
            metric_last_updated.append(
                last_row["timestamp"][0] + timedelta(seconds=GRANULARITY_SECONDS)
            )

    global_last_updated = (
        max(metric_last_updated) if len(metric_last_updated) > 0 else None
    )
    if not global_last_updated:
        return None

    return convert_utc_to_uk(global_last_updated).strftime("%Y-%m-%d %H:%M:%S")


def get_latest_metric_value(output_filename: str) -> str:
    parquet_path = get_parquet_file_path(output_filename)
    table = read_parquet(parquet_path, columns=["value"])
    if not table:
        return "Null"
    last_row = get_last_rows_from_table(table)
    value = last_row["value"][0]

    if output_filename == "base_infra_ecs_cluster_cpu_utilisation":
        return f"{value:.2f}%"
    elif output_filename in [
        "conductor_elb_active_connection_count",
        "leds_incoming_message_queue_num_msg_received",
    ]:
        value = int(value)
        return f"{value:d}"
    else:
        return f"{value}"


def get_historic_metric_values(
    output_filename: str, n_values: int
) -> dict[str, list[float]]:
    parquet_path = get_parquet_file_path(output_filename)
    sql = f"""
        SELECT
            date_trunc('day', timestamp) AS day,
            AVG(value) AS avg_value
        FROM read_parquet('{parquet_path}')
        WHERE timestamp >= current_localtimestamp() - INTERVAL '{n_values} DAY'
        GROUP BY date_trunc('day', timestamp)
        ORDER BY day;
    """
    result = query_duckdb(sql)

    timestamps = []
    values = []
    for row in result:
        timestamps.append(row[0].strftime("%b %d"))
        values.append(row[1])

    return {"timestamp": timestamps, "value": values}


def transform() -> None:
    ui_data = {}
    ui_data["last_updated"] = get_last_updated(METRICS_CONFIG)

    for config in METRICS_CONFIG:
        filename = config["output_filename"]
        ui_data[filename] = get_latest_metric_value(filename)

        ui_data[filename + "_historic"] = get_historic_metric_values(filename, 10)

    s3 = boto3.client("s3")
    # json file overwritten on each run
    s3.put_object(
        Bucket=BUCKET_NAME,
        Key=JSON_OUTPUT_KEY,
        Body=json.dumps(ui_data),
        ContentType="application/json",
    )
    logger.info(f"ui data updated: {BUCKET_NAME=}, {JSON_OUTPUT_KEY=}")
