import pytest

from ingestion.main import extract_item_from_export_line

FULL_INPUT = {
    "Item": {
        "my_id": {"S": "id1"},
        "event_date": {"S": "date1"},
        "value": {"N": "412"},
        "status": {"S": "PENDING"},
    }
}

FULL_OUTPUT = {
    "my_id": {"S": "id1"},
    "event_date": {"S": "date1"},
    "value": {"N": "412"},
    "status": {"S": "PENDING"},
}

INC_INPUT = {
    "Metadata": {"WriteTimestampMicros": {"N": "1790257678031355"}},
    "Keys": {
        "event_date": {"S": "date1"},
        "my_id": {"S": "id1"},
    },
    "NewImage": {
        "event_date": {"S": "date1"},
        "my_id": {"S": "id1"},
        "status": {"S": "FAILED"},
        "value": {"N": "217"},
    },
}

INC_OUTPUT = {
    "event_date": {"S": "date1"},
    "my_id": {"S": "id1"},
    "status": {"S": "FAILED"},
    "value": {"N": "217"},
}

MALFORMED_INPUT = {"key": "value"}

DELETED_INPUT = {
    "Metadata": {"WriteTimestampMicros": {"N": "1790257678031355"}},
    "Keys": {"event_date": {"S": "date1"}, "my_id": {"S": "id1"}},
}


def test_extract_item_from_export_line_inc():
    output = extract_item_from_export_line(INC_INPUT)
    assert output == INC_OUTPUT


def test_extract_item_from_export_line_full():
    output = extract_item_from_export_line(FULL_INPUT)
    assert output == FULL_OUTPUT


def test_extract_item_from_export_line_deleted():
    output = extract_item_from_export_line(DELETED_INPUT)
    assert output == DELETED_INPUT["Keys"]


def test_extract_item_from_export_line_malformed_input():
    with pytest.raises(ValueError):
        _ = extract_item_from_export_line(MALFORMED_INPUT)
