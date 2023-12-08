process.env.AWS_REGION = "eu-west-2"
process.env.S3_REGION = process.env.AWS_REGION
process.env.S3_AWS_ACCESS_KEY_ID = "S3RVER"
process.env.S3_AWS_SECRET_ACCESS_KEY = "S3RVER"
process.env.S3_ENDPOINT = "http://localhost:4566"
process.env.AWS_ACCESS_KEY_ID = "test"
process.env.AWS_SECRET_ACCESS_KEY = "test"
process.env.MQ_AUTH = '{"username": "bichard", "password": "password"}'
process.env.MQ_URL = "failover:(ws://localhost:61614)"
process.env.INCOMING_BUCKET_NAME = "incoming-messages"
process.env.AUDIT_LOG_API_URL = "http://localhost:7010"
process.env.AUDIT_LOG_API_KEY = "dummy"
process.env.TASK_DATA_BUCKET_NAME = "conductor-task-data"

process.env.DYNAMO_URL = "http://localhost:8000"
process.env.DYNAMO_REGION = "test"
