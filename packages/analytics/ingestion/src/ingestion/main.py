import logging
import os
from collections.abc import Iterator
from dataclasses import dataclass
from typing import Any, Literal

import dlt
from boto3.dynamodb.types import TypeDeserializer
from dlt.common import json
from dlt.common.pipeline import LoadInfo
from dlt.common.storages.fsspec_filesystem import FileItemDict
from dlt.common.typing import TDataItems
from dlt.destinations import filesystem as dest_filesystem
from dlt.extract import DltResource
from dlt.pipeline import Pipeline
from dlt.sources.filesystem import filesystem as src_filesystem
from smart_open import open

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

ExportType = Literal["incremental", "full"]


def extract_item_from_export_line(export_line: dict[str, Any]) -> dict[str, Any]:
    """
    Extracts the dictionary containing the actual item from a single line from
    a dynamodb export.

    Handles incremental and full exports as of 2026-10:
    https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/S3DataExport.Output.html
    """

    # handle full exports
    output = export_line.get("Item")

    # handle incremental exports
    if not output:
        output = export_line.get("NewImage")

    # handle incremental export deleted values
    if not output and "Keys" in export_line:
        output = export_line.get("Keys")

    if not output or not isinstance(output, dict):
        raise ValueError(
            "Malformed DynamoDB export record. Expected non-empty dict containing one of ['Item', 'NewImage'], "
            f"got {type(output).__name__} with value: {export_line!r}"
        )

    return output


def dynamo_obj_to_python_obj(dynamo_obj: dict[str, Any]) -> dict[str, Any]:
    """Deserialises a dynamodb item"""
    deserializer = TypeDeserializer()
    return {k: deserializer.deserialize(v) for k, v in dynamo_obj.items()}


@dlt.transformer
def read_dynamodb_export_jsonl(
    items: Iterator[FileItemDict], chunksize: int = 1000
) -> Iterator[TDataItems]:
    """Read jsonl file from a dynamodb (incremental or full) export and extract the data.
    Based on the stock dlt read_jsonl function.

    Args:
        chunksize (int, optional): The number of JSON lines to load and yield at once, defaults to 1000

    Returns:
        TDataItem: The file content
    """
    for file_obj in items:
        with file_obj.open(mode="rb") as f:
            lines_chunk: list[Any] = []
            for line in f:
                line = json.loadb(line)
                new_image = extract_item_from_export_line(line)
                new_image_deserialised = dynamo_obj_to_python_obj(new_image)
                lines_chunk.append(new_image_deserialised)
                if len(lines_chunk) >= chunksize:
                    yield lines_chunk
                    lines_chunk: list[Any] = []
        if lines_chunk:
            yield lines_chunk


@dataclass(frozen=True, slots=True)
class Manifest:
    export_type: ExportType
    data_filepaths: list[str]
    item_count: int | None

    @classmethod
    def from_summary_file(cls, bucket_uri: str, summary_file_key: str) -> "Manifest":
        """Factory method to parse and construct a Manifest from a summary file."""
        summary_uri = (
            bucket_uri.rstrip("/") + "/" + summary_file_key.lstrip("/")
        )
        summary = cls._load_json(summary_uri)

        export_type: ExportType = "incremental" if summary.get(
            "exportType") else "full"
        item_count = summary.get("itemCount")
        item_count = int(item_count) if item_count else item_count

        manifest_files_key = summary["manifestFilesS3Key"]
        manifest_files_uri = (
            bucket_uri.rstrip("/") + "/" + manifest_files_key.lstrip("/")
        )
        manifest_files = cls._load_jsonl(manifest_files_uri)

        data_filepaths = [entry["dataFileS3Key"] for entry in manifest_files]

        return cls(
            export_type=export_type,
            data_filepaths=data_filepaths,
            item_count=item_count,
        )

    @staticmethod
    def _load_json(uri: str) -> dict[str, Any]:
        logger.debug(f"Opening '{uri}'")
        with open(uri, "r", encoding="utf-8") as f:
            return json.load(f)

    @staticmethod
    def _load_jsonl(uri: str) -> list[dict[str, Any]]:
        logger.debug(f"Opening '{uri}'")
        with open(uri, "r", encoding="utf-8") as f:
            return [json.loads(line) for line in f if line.strip()]


def get_write_disposition(
    export_type: ExportType
) -> Literal["append", "merge", "replace", "skip"]:
    if export_type == "incremental":
        return "append"
    elif export_type == "full":
        return "replace"
    else:
        raise ValueError(
            f"Export type should be 'full' or 'incremental', got {export_type}"
        )


def get_files_resource(
    bucket_url: str, file_glob: str, manifest_paths: list[str]
) -> DltResource:
    files = src_filesystem(bucket_url=bucket_url, file_glob=file_glob)
    logger.debug("source filesystem output (pre filter).....")
    # logger.info(list(files)[0])
    for file in list(files):
        logger.debug(file)
    return files.add_filter(lambda item: item["relative_path"] in manifest_paths)


def log_pipeline_details(pipeline: Pipeline, load_info: LoadInfo) -> None:
    try:
        logger.info("Printing load info...")
        logger.info(load_info)

        trace = getattr(pipeline, "last_trace", None)
        logger.info("Printing last trace...")
        logger.info(trace)

        if not trace:
            logger.info("No trace details available.")
            return

        # Type checkers know trace is not None here:
        logger.info("last extract")
        logger.info(trace.last_extract_info)

        logger.info("last normalize")
        logger.info(trace.last_normalize_info)

        if trace.last_normalize_info:
            logger.info("last normalise row counts")
            logger.info(trace.last_normalize_info.row_counts)

        logger.info("last load")
        logger.info(trace.last_load_info)

    except Exception:
        # Catches unexpected attribute errors or string formatting issues
        logger.warning("Could not log pipeline details", exc_info=True)


def log_files_details(files_resource: DltResource, manifest_files_list: list[str]):
    logger.debug("manifest files list......")
    for file in manifest_files_list:
        logger.debug("   " + file)
    logger.debug("dlt source filesystem resource 'relative_path' output.....")
    for file in list(files_resource):
        logger.debug("   " + file.get("relative_path"))


def main() -> None:
    FILE_GLOB = "**/*.json*"

    SRC_BUCKET_URL = os.environ["SRC_BUCKET_URL"]
    DEST_BUCKET_URL = os.environ["DEST_BUCKET_URL"]
    MANIFEST_SUMMARY_KEY = os.environ["MANIFEST_SUMMARY_KEY"]

    # SRC_BUCKET_URL = "tests/data"
    # DEST_BUCKET_URL = "/tmp"
    # MANIFEST_SUMMARY_KEY = "dummy_landing_zone/id1/manifest-summary.json"
    # SRC_BUCKET_URL = "s3://bichard-7-e2e-test-analytics-data-store"
    # DEST_BUCKET_URL = "s3://bichard-7-e2e-test-analytics-data-store"
    # MANIFEST_SUMMARY_KEY = "landing_zone/dynamodb/audit-log/export_date=2026-10-28/AWSDynamoDB/01793145628000-bb5dec7b/manifest-summary.json"

    manifest = Manifest.from_summary_file(
        bucket_uri=SRC_BUCKET_URL, summary_file_key=MANIFEST_SUMMARY_KEY
    )
    write_disposition = get_write_disposition(manifest.export_type)

    files = get_files_resource(
        bucket_url=SRC_BUCKET_URL,
        file_glob=FILE_GLOB,
        manifest_paths=manifest.data_filepaths,
    )

    log_files_details(files, manifest.data_filepaths)

    jsonl_resource = files | read_dynamodb_export_jsonl()
    jsonl_resource = jsonl_resource.apply_hints(
        table_name="audit_log",
        write_disposition=write_disposition,
        columns={"events_count": {"data_type": "bigint"}},
    )

    iceberg_dest = dest_filesystem(
        bucket_url=DEST_BUCKET_URL, destination_name="iceberg_destination")

    pipeline = dlt.pipeline(
        # pipeline name -> database name (not used in AWS Glue)
        pipeline_name="audit_log_landing_to_bronze",
        destination=iceberg_dest,
        # dataset name -> schema name (database name in AWS Glue)
        dataset_name="bronze_audit_log",
        progress="log",
        dev_mode=True,
    )

    load_info = pipeline.run(jsonl_resource, table_format="iceberg")

    log_pipeline_details(pipeline, load_info)

    pipeline.run([load_info], table_name="_load_info")
    pipeline.run([pipeline.last_trace], table_name="_trace")
