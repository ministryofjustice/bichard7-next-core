import logging
from typing import Any, List

# pyarrow used to keep dependencies light (as opposed to pandas/polars/duckdb)
import pyarrow as pa
import pyarrow.parquet as pq
from pyarrow.lib import ArrowInvalid

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# TODO env (UAT, prod, etc) from container env var
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
    {
        "output_filename": "leds_incoming_message_queue_num_msg_received",
        "namespace": "AWS/SQS",
        "metric_name": "NumberOfMessagesReceived",
        "queue_name": "bichard-7-leds-incomingMessageQueue",
    },
]

BUCKET_NAME = "bichard-7-demo-status-page"
TABLE_OUTPUT_PREFIX = "data_tables/"
JSON_OUTPUT_KEY = "_data/ui_data.json"
DEFAULT_BACKFILL_DAYS = 1
GRANULARITY_SECONDS = 60
PA_SCHEMA = pa.schema(
    [
        ("timestamp", pa.timestamp(unit="s")),
        ("value", pa.float32()),
        ("insert_timestamp", pa.timestamp(unit="s")),
    ]
)


def get_parquet_file_path(output_filename: str):
    return f"s3://{BUCKET_NAME}/{TABLE_OUTPUT_PREFIX}{output_filename}.parquet"


def read_parquet(path: str, columns: List[str]) -> pa.Table | None:
    try:
        file = pq.ParquetFile(path)
    except FileNotFoundError:
        logger.info(f"File not found, treating it as a new metric. {path}")
        return None
    except (OSError, ArrowInvalid) as e:
        logger.info(f"Cannot read file, the path or file is invalid '{path}'")
        logger.info(e)
        raise (e)

    return file.read(columns=columns)


def get_last_row_from_table(table: pa.Table) -> dict:
    if len(table) > 0:
        return table.slice(table.num_rows - 1, 1).to_pydict()
    else:
        logger.info("0 columns found in table")
        return {}
