import os
import random
import xml.parsers.expat
from copy import deepcopy
from datetime import datetime, time
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

import boto3
import pandas as pd
import xmltodict
from deltalake.exceptions import CommitFailedError
from deltalake.writer import write_deltalake
from pandas import DataFrame

SPI_NAMESPACE_MAPPING = {
    "http://schemas.cjse.gov.uk/common/operations": "ns1",
    "http://schemas.cjse.gov.uk/common/businessentities": "ns2",
    "http://schemas.cjse.gov.uk/common/businesstypes": "ns3",
}
DATASTREAMCONTENT_NAMESPACE_MAPPING = {"http://www.dca.gov.uk/xmlschemas/libra": ""}


def _ensure_list(data: Any) -> list[dict]:
    """Ensures input is always a list of dicts, handling None, dict, or list."""
    if isinstance(data, dict):
        return [data]
    if isinstance(data, list):
        return data
    return []


def _remove_key_from_target(target: list[dict] | dict | None, key_to_remove: str):
    """
    Removes a key from the target data, whether the target is
    a dictionary, a list of dictionaries, or None.
    """
    if isinstance(target, list):
        for item in target:
            if isinstance(item, dict):
                item.pop(key_to_remove, None)

    elif isinstance(target, dict):
        target.pop(key_to_remove, None)


def extract_file_uuid(filename: str) -> str:
    filename = os.path.basename(filename)
    return os.path.splitext(filename)[0]


def parse_s3_path(filename: str | Path) -> tuple[str, str]:
    """
    Parses an s3:// URI and returns a tuple of (bucket_name, key).
    """
    parsed_url = urlparse(str(filename))
    return parsed_url.netloc, parsed_url.path.lstrip("/")


def extract_message_received_datetime(filename: str, include_time: bool) -> str:
    """Using s3 filepath, returns the datetime bichard recieved the file in the format 'YYYY-MM-DD HH:mm:00'"""
    # s3://bichard-7-production-conductor-internal-incoming-messages/2026/04/05/10/29/f37dc449-820f-4497-93ca-bd62107109df.xml

    if filename.startswith("s3://"):
        _, key = parse_s3_path(filename)

        key_split = key.split("/")
        key_split.pop(-1)
        key_split = [int(k) for k in key_split]
        if include_time:
            return datetime(
                year=key_split[0],
                month=key_split[1],
                day=key_split[2],
                hour=key_split[3],
                minute=key_split[4],
            ).strftime("%Y-%m-%d %H:%M:00")
        else:
            return datetime(
                year=key_split[0],
                month=key_split[1],
                day=key_split[2],
            ).strftime("%Y-%m-%d")

        # s3_client = boto3.client("s3")
        # response = s3_client.head_object(Bucket=bucket_name, Key=key)

        # # LastModified is already a datetime object (timezone-aware)
        # last_modified: datetime = response["LastModified"]
        # return last_modified.strftime("%Y-%m-%d")

    else:
        # Fallback to local filesystem
        if not os.path.exists(filename):
            raise FileNotFoundError(f"Local file not found: {filename}")

        # Get the last modification time (POSIX timestamp) and convert it
        mtime_timestamp = os.path.getmtime(filename)
        last_modified = datetime.fromtimestamp(mtime_timestamp)
        return last_modified.strftime("%Y-%m-%d")


def inject_metadata(
    base_dict: dict,
    file_uuid: str,
    file_uri: str,
    message_received_date: str,
    message_received_datetime: str,
    ingest_datetime: str,
) -> dict:
    base_dict["_file_uuid"] = file_uuid
    base_dict["_file_uri"] = file_uri
    base_dict["_message_received_date"] = message_received_date
    base_dict["_message_received_datetime"] = message_received_datetime
    base_dict["_ingest_datetime"] = ingest_datetime
    return base_dict


def _fetch_raw_bytes(source: str | Path) -> bytes:
    """Fetches raw bytes from either an S3 URI or a local file path."""
    source_str = str(source)
    if source_str.startswith("s3://"):
        bucket, key = parse_s3_path(source_str)
        s3_client = boto3.client("s3")
        return s3_client.get_object(Bucket=bucket, Key=key)["Body"].read()

    with open(source_str, "rb") as f:
        return f.read()


def _parse_xml_bytes_with_fallback(raw_bytes: bytes, **kwargs) -> dict:
    """Parses raw XML bytes, falling back to lossy UTF-8 decoding and

    character stripping if an ExpatError occurs.
    """
    try:
        # Fast path: Parse raw bytes directly
        return xmltodict.parse(raw_bytes, **kwargs)
    except (xml.parsers.expat.ExpatError, UnicodeDecodeError):
        # Fallback path
        decoded = raw_bytes.decode("utf-8", errors="replace")
        return xmltodict.parse(decoded, **kwargs)


def extract_session_from_spi(filename: str | Path) -> dict:
    filename = str(filename)
    raw_bytes = _fetch_raw_bytes(filename)

    spi_dict = _parse_xml_bytes_with_fallback(
        raw_bytes, process_namespaces=True, namespaces=SPI_NAMESPACE_MAPPING
    )

    message_str = spi_dict["ns1:RouteData"]["ns1:DataStream"]["ns2:DataStreamContent"]
    message_str = message_str.replace("&lt;", "<")
    message_str = message_str.replace("&gt;", ">")

    message_dict = xmltodict.parse(
        message_str,
        process_namespaces=True,
        namespaces=DATASTREAMCONTENT_NAMESPACE_MAPPING,
    )
    return message_dict["ResultedCaseMessage"]["Session"]


def flatten_base_dict(base_dict: dict) -> pd.DataFrame:
    # Create a copy to avoid mutating the original JSON data
    base_dict_copy = deepcopy(base_dict)
    _remove_key_from_target(base_dict_copy["Case"]["Defendant"], "Offence")
    df_norm = pd.json_normalize(base_dict_copy)
    return df_norm


def flatten_offences_dict(base_dict: dict) -> pd.DataFrame:
    # Create a copy to avoid mutating the original JSON data
    base_dict_copy = deepcopy(base_dict)
    _remove_key_from_target(base_dict_copy["Case"]["Defendant"]["Offence"], "Result")
    offences_df = pd.json_normalize(
        base_dict_copy["Case"]["Defendant"].get("Offence", [])
    )
    return offences_df.add_prefix("Case.Defendant.Offence.")


def flatten_results_dict(base_dict: dict) -> pd.DataFrame:
    combined_results = []

    # handles Offence being a dict, list of dict, or non existant
    offences = _ensure_list(base_dict["Case"]["Defendant"].get("Offence"))

    for offence in offences:
        # TODO using the pandas index of the offence to join on may be more robust
        seq_no = offence["BaseOffenceDetails"]["OffenceSequenceNumber"]
        results = _ensure_list(offence.get("Result"))

        for result in results:
            result_copy = deepcopy(result)
            result_copy["_seq_no"] = seq_no
            combined_results.append(result_copy)

    if not combined_results:
        return pd.DataFrame().add_prefix("Case.Defendant.Offence.Result.")

    results_df = pd.json_normalize(combined_results)
    return results_df.add_prefix("Case.Defendant.Offence.Result.")


def merge_dfs(
    base_df: pd.DataFrame, offences_df: pd.DataFrame, results_df: pd.DataFrame
) -> pd.DataFrame:
    df_merge1 = pd.merge(
        offences_df,
        results_df,
        how="left",
        left_on="Case.Defendant.Offence.BaseOffenceDetails.OffenceSequenceNumber",
        right_on="Case.Defendant.Offence.Result._seq_no",
    )
    df_merge1 = df_merge1.drop(columns="Case.Defendant.Offence.Result._seq_no")

    df_merge2 = base_df.merge(df_merge1, how="cross")
    df_merge2.columns = [c.replace(".", "_") for c in df_merge2.columns]
    return df_merge2


def drop_sensitive_data(message: dict) -> dict:
    try:
        message["Case"]["Defendant"]["CourtIndividualDefendant"]["PersonDefendant"].pop(
            "BasePersonDetails", None
        )
    except (KeyError, TypeError):
        pass  # no need to do anything if BasePersonDetails doesn't exist (e.g. for a corporate defendant)
    try:
        message["Case"]["Defendant"]["CourtIndividualDefendant"].pop("Address", None)
    except (KeyError, TypeError):
        pass
    return message


def convert_column_to_list(df: pd.DataFrame, column_name: str) -> pd.DataFrame:
    """Converts the specified column to a list if not already.

    Handles scalars, numpy arrays, and existing lists/iterables safely.
    """
    if column_name not in df.columns:
        return df

    # Create a copy to avoid SettingWithCopyWarning and side-effects
    df_copy = df.copy()

    # Convert elements to lists if they aren't already
    df_copy[column_name] = df_copy[column_name].apply(
        lambda x: (
            x
            if isinstance(x, list)
            else (list(x) if hasattr(x, "__iter__") and not isinstance(x, str) else [x])
        )
    )

    return df_copy


def write(df: pd.DataFrame, dest_path: str) -> None:
    write_deltalake(
        dest_path,
        df,
        mode="append",
        schema_mode="merge",  # Automatically handles missing/new fields
        partition_by=[
            # we know this is always present, small risk using CourtHearingDate
            "_message_received_date"
        ],
    )


def write_with_retries(
    df: pd.DataFrame, dest_path: str, max_retries: int = 5, initial_delay: float = 0.5
) -> None:
    """
    Retries a delta lake write on CommitFailedError using exponential backoff with jitter.
    """
    attempt = 0
    delay = initial_delay

    while True:
        try:
            write(df, dest_path)
            return
        except CommitFailedError as e:
            attempt += 1
            if attempt > max_retries:
                raise RuntimeError(
                    f"Failed to commit to Delta table at '{dest_path}' after {max_retries} retries."
                ) from e

            current_delay = random.uniform(0, min(delay, 10.0))

            print(
                f"[Attempt {attempt}/{max_retries}] Delta Lake commit collision on '{dest_path}'. "
                f"Retrying in {current_delay:.2f}s..."
            )
            time.sleep(current_delay)
            delay *= 2.0


def spi_xml_to_df(xml_file_path: str) -> DataFrame:
    message = extract_session_from_spi(filename=xml_file_path)
    message = drop_sensitive_data(message)

    file_uuid = extract_file_uuid(filename=xml_file_path)
    mrd = extract_message_received_datetime(filename=xml_file_path, include_time=False)
    mrdt = extract_message_received_datetime(filename=xml_file_path, include_time=True)
    message = inject_metadata(
        base_dict=message,
        file_uuid=file_uuid,
        file_uri=xml_file_path,
        message_received_date=mrd,
        message_received_datetime=mrdt,
        ingest_datetime=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    )

    base_df = flatten_base_dict(message)
    offences_df = flatten_offences_dict(message)
    results_df = flatten_results_dict(message)
    df = merge_dfs(base_df, offences_df, results_df)

    # according to the schema documentation (bichard-next-core repo) these columns can be scalar or array of str
    df = convert_column_to_list(df, "Case_Defendant_Offence_Result_ResultCodeQualifier")
    df = convert_column_to_list(
        df, "Case_Defendant_Offence_Result_Duration_DurationStartDate"
    )

    # drop any columns that are unnecessary or cause problems with reading (i.e. Null columns)
    cols_to_drop = [
        "Case_Defendant_Offence_BaseOffenceDetails_OffenceWording",
        "Case_Defendant_Offence_BaseOffenceDetails_OffenceWording_br"
    ]
    df.drop(columns=cols_to_drop, inplace=True, errors='ignore')
    return df


def spi_xml_to_delta_table(xml_file_path: str, delta_table_path: str):
    df = spi_xml_to_df(xml_file_path)
    write_with_retries(df, delta_table_path)
