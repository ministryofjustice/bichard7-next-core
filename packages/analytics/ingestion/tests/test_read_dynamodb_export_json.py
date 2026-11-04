import io
from unittest.mock import patch

import dlt
import pytest

from ingestion.main import read_dynamodb_export_jsonl


# pyrefly: ignore [implicit-any-type-argument]
class MockFileItem(dict):
    """Mock that behaves like a real dlt FileItemDict in production."""
    def __init__(self, content: bytes, file_name: str = "test.jsonl"):
        super().__init__({
            "file_name": file_name,
            "file_url": f"s3://bucket/{file_name}",
            "size": len(content),
        })
        self.content = content

    def open(self, mode: str="rb"):
        return io.BytesIO(self.content)


@pytest.fixture
def sample_jsonl_bytes():
    return (
        b'{"Item": {"id": {"S": "1"}, "val": {"N": "100"}}}\n'
        b'{"Item": {"id": {"S": "2"}, "val": {"N": "200"}}}\n'
        b'{"Item": {"id": {"S": "3"}, "val": {"N": "300"}}}\n'
    )


@patch("dynamo_to_delta.main.dynamo_obj_to_python_obj")
@patch("dynamo_to_delta.main.extract_item_from_export_line")
def test_read_dynamodb_export_jsonl_chunking(
    # pyrefly: ignore [implicit-any-parameter]
    mock_extract, mock_deserialise, sample_jsonl_bytes
):
    # Setup mock returns
    # pyrefly: ignore [implicit-any-lambda]
    mock_extract.side_effect = lambda line: line["Item"]
    # pyrefly: ignore [implicit-any-lambda]
    mock_deserialise.side_effect = lambda item: {
        "id": item["id"]["S"],
        "val": int(item["val"]["N"]),
    }

    @dlt.resource
    def mock_filesystem_resource():
        yield [MockFileItem(sample_jsonl_bytes)]

    transformer_pipe = mock_filesystem_resource() | read_dynamodb_export_jsonl(chunksize=2)
    results = list(transformer_pipe)

    assert len(results) == 3

    assert results[0] == {"id": "1", "val": 100}
    assert results[1] == {"id": "2", "val": 200}
    assert results[2] == {"id": "3", "val": 300}

    assert mock_extract.call_count == 3
    assert mock_deserialise.call_count == 3


# pyrefly: ignore [implicit-any-lambda]
@patch("dynamo_to_delta.main.dynamo_obj_to_python_obj", side_effect=lambda x: x)
# pyrefly: ignore [implicit-any-lambda]
@patch("dynamo_to_delta.main.extract_item_from_export_line", side_effect=lambda x: x)
# pyrefly: ignore [implicit-any-parameter]
def test_read_dynamodb_export_jsonl_empty_file(mock_extract, mock_deserialise):
    @dlt.resource
    def mock_filesystem_resource():
        yield [MockFileItem(b"")]

    transformer_pipe = mock_filesystem_resource() | read_dynamodb_export_jsonl(chunksize=2)
    results = list(transformer_pipe)

    assert len(results) == 0
