import logging
import traceback

import boto3
import pandas as pd
from deltalake import write_deltalake

from spi_transform.spi_xml_to_delta_table import parse_s3_path, spi_xml_to_delta_table

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

SOURCE_PATH = (
    "s3://bichard-7-production-conductor-internal-incoming-messages/2026/07/28/17"
)
DEST_PATH = "s3://joe-u-delta-table-test/spi_messages"
ERROR_PATH = "s3://joe-u-delta-table-test/spi_messages_errors"


def list_s3_files(s3_path: str):
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


def main():
    # dt = DeltaTable("./spi_messages_errors")

    # dt.alter.set_table_properties(
    #     {
    #         # Keep only 24 hours of history for time travel / log files
    #         "delta.logRetentionDuration": "interval 24 hours",
    #         # Keep deleted parquet files for 15 minutes max (safeguard for active readers)
    #         "delta.deletedFileRetentionDuration": "interval 15 minutes",
    #         # Checkpoint every 100 commits (crucial for a 10k/day write volume)
    #         "delta.checkpointInterval": "100",
    #     }
    # )

    # 1. Get the list of XML files
    xml_files = list_s3_files(SOURCE_PATH)

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


if __name__ == "__main__":
    main()
