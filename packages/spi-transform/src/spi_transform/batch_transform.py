import logging
import os
import sys
import traceback
from collections.abc import Generator
from datetime import date, datetime, timedelta
from typing import Any

import boto3
import duckdb
import pandas as pd
from deltalake import DeltaTable, write_deltalake

from spi_transform.spi_xml_to_delta_table import (
    parse_s3_path,
    spi_xml_to_df,
    write_with_retries,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)


def get_required_env(var_name: str) -> str:
    value = os.getenv(var_name)
    if not value:
        print(f"FATAL: Environment variable {var_name} is not set.", file=sys.stderr)
        sys.exit(1)
    return value


def query_duckdb(sql: str) -> list[tuple[Any, ...]]:
    with duckdb.connect() as con:
        con.execute("SET s3_region='eu-west-2';")
        con.execute(
            "CREATE OR REPLACE SECRET delta_s1 (TYPE s3, PROVIDER credential_chain);"
        )
        return con.execute(sql).fetchall()


def yeild_uningested_file_paths(
    base_path: str, delta_path: str, error_path: str, batch_size: int
) -> Generator[list[str]]:
    sql = f"""
        SELECT raw.file as raw_path
        FROM glob('{base_path}/**/*.xml') AS raw
        ANTI JOIN delta_scan('{delta_path}') AS delta
            ON raw.file = delta._file_uri
        ANTI JOIN delta_scan('{error_path}') AS error_delta
            ON raw.file = error_delta._file_uri
    """
    rows = query_duckdb(sql)
    file_list = [row[0] for row in rows]
    logger.info(f"{len(file_list)} files to process in batches of {batch_size}.")
    batch_id = 0
    for i in range(0, len(file_list), batch_size):
        batch_id += batch_id
        logger.info(f"Processing batch {batch_id}...")
        yield file_list[i : i + batch_size]


def list_s3_files(s3_path: str) -> list[str]:
    """Parses an s3:// URL and lists all XML files in that prefix."""
    bucket_name, prefix = parse_s3_path(s3_path)

    s3 = boto3.client("s3")

    try:
        logger.info(f"Listing files in bucket: '{bucket_name}' with prefix: '{prefix}'")
        paginator = s3.get_paginator("list_objects_v2")
        pages = paginator.paginate(Bucket=bucket_name, Prefix=prefix)

        file_paths = []
        for page in pages:
            for obj in page.get("Contents", []):
                key = obj["Key"]
                # Ensure we only grab .xml files and skip the directory itself
                if key.endswith(".xml"):
                    file_paths.append(f"s3://{bucket_name}/{key}")

        return file_paths
    except Exception as e:  # noqa: BLE001 # disable ruff warning: catching bare exception is fine for now
        logger.error(f"Failed to list S3 files: {e}")
        return []


def get_prefixes_in_date_range(start_date: date, end_date: date) -> list[str]:
    """
    Takes start and end dates in datetime.date format, and returns a list of
    strings in the form YYYY/MM/DD/. This is the partitioning strategy used in
    the incoming messges s3 bucket.
    """
    prefixes = []
    current_date = start_date
    while current_date <= end_date:
        prefixes.append(current_date.strftime("%Y/%m/%d/"))
        current_date += timedelta(days=1)

    return prefixes


def list_s3_files_in_date_range(
    base_path: str, start_date: str, end_date: str
) -> list[str]:
    start_date = datetime.strptime(start_date, "%Y-%m-%d")
    end_date = datetime.strptime(end_date, "%Y-%m-%d")

    if not base_path.endswith("/"):
        base_path = base_path + "/"

    files = []
    for prefix in get_prefixes_in_date_range(start_date, end_date):
        files.extend(list_s3_files(base_path + prefix))
    return files


def optimise_delta_table(path: str) -> None:
    dt = DeltaTable(path)
    dt.alter.set_table_properties(
        {
            # Keep only 24 hours of history for time travel / log files
            "delta.logRetentionDuration": "interval 24 hours",
            # Keep deleted parquet files for a bit as a safeguard for active readers
            "delta.deletedFileRetentionDuration": "interval 2 hours",
            # Checkpoint every 100 commits (crucial for a 10k/day write volume)
            "delta.checkpointInterval": "100",
        }
    )

    logger.info(f"Optimising delta table: {path}")
    dt.optimize.compact()
    logger.info("Compaction complete")
    dt.vacuum(dry_run=False)
    logger.info("Vacuum complete")
    logger.info(f"Optimisation complete for '{path}'")


def main():
    SOURCE_PATH = get_required_env("SPI_TRANSFORM_SOURCE_PATH")
    DEST_PATH = get_required_env("SPI_TRANSFORM_DEST_PATH")
    ERROR_PATH = get_required_env("SPI_TRANSFORM_ERROR_PATH")

    for xml_files_batch in yeild_uningested_file_paths(
        SOURCE_PATH, DEST_PATH, batch_size=1000
    ):
        batch_dfs = []
        for index, file_path in enumerate(xml_files_batch, start=1):
            logger.info(
                f"[{index}/{len(xml_files_batch)}] Processing file: {file_path}"
            )

            try:
                df = spi_xml_to_df(xml_file_path=file_path)
                if df is not None and not df.empty:
                    batch_dfs.append(df)
                    logger.info(f"Successfully processed: {file_path}")
                else:
                    raise ValueError(
                        f"Unable to convert {file_path} to a non-empty df."
                    )

            except Exception as e:
                error_msg = str(e)
                logger.exception(f"Failed to process {file_path}")

                # Capture the full traceback as a string
                full_traceback = traceback.format_exc()

                error_dict = {
                    "file_path": file_path,
                    "error_msg": error_msg,
                    "full_traceback": full_traceback,
                }
                error_df = pd.DataFrame([error_dict])
                write_deltalake(
                    ERROR_PATH,
                    error_df,
                    mode="append",
                    schema_mode="merge",  # Automatically handles missing/new fields
                )

        main_df = pd.concat(batch_dfs, axis=0, ignore_index=True)
        write_with_retries(main_df, DEST_PATH)

    # 3. optimise
    optimise_delta_table(DEST_PATH)
    optimise_delta_table(ERROR_PATH)


if __name__ == "__main__":
    main()
