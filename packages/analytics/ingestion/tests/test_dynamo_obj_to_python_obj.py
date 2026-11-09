from ingestion.main import dynamo_obj_to_python_obj

TEST_OBJ = {
    "my_id": {"S": "id"},
    "event_date": {"S": "mydate"},
    "value": {"N": "412"},
    "status": {"S": "PENDING"},
}

UNMARSHALLED_OBJ = {
    "my_id": "id",
    "event_date": "mydate",
    "value": 412,
    "status": "PENDING",
}


def test_dynamo_obj_to_python_obj_happy_path():
    output = dynamo_obj_to_python_obj(TEST_OBJ)
    assert output == UNMARSHALLED_OBJ
