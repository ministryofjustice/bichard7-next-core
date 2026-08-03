import logging
import os
import sys
import traceback
from datetime import date, datetime, timedelta

import boto3
import pandas as pd
from deltalake import DeltaTable, write_deltalake

from spi_transform.spi_xml_to_delta_table import parse_s3_path, spi_xml_to_delta_table

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
            # Keep deleted parquet files for 15 minutes max (safeguard for active readers)
            "delta.deletedFileRetentionDuration": "interval 15 minutes",
            # Checkpoint every 100 commits (crucial for a 10k/day write volume)
            "delta.checkpointInterval": "100",
        }
    )

    logger.info(f"Optimising delta table: {path}")
    dt.optimize.compact()
    logger.info("Compaction complete")
    dt.vacuum(dry_run=False)
    logger.info("Vacuum complete")
    logger.info("Optimisation complete for '{path}'")


def main():
    SOURCE_PATH = get_required_env("SPI_TRANSFORM_SOURCE_PATH")
    DEST_PATH = get_required_env("SPI_TRANSFORM_DEST_PATH")
    ERROR_PATH = get_required_env("SPI_TRANSFORM_ERROR_PATH")
    START_DATE = get_required_env("SPI_TRANSFORM_START_DATE")
    END_DATE = get_required_env("SPI_TRANSFORM_END_DATE")

    # 1. Get the list of XML files
    xml_files = list_s3_files_in_date_range(SOURCE_PATH, START_DATE, END_DATE)
    if not xml_files:
        logger.warning(f"No XML files found at {SOURCE_PATH}")
        return

    logger.info(f"Found {len(xml_files)} XML file(s) to process.")

    # 2. Loop through and process each file
    for index, file_path in enumerate(xml_files, start=1):
        logger.info(f"[{index}/{len(xml_files)}] Processing file: {file_path}")

        try:
            spi_xml_to_delta_table(xml_file_path=file_path, delta_table_path=DEST_PATH)
            logger.info(f"Successfully processed: {file_path}")

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

    # 3. optimise
    optimise_delta_table(DEST_PATH)
    optimise_delta_table(ERROR_PATH)


if __name__ == "__main__":
    main()
