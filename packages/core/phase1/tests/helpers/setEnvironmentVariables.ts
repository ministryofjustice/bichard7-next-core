process.env.AWS_REGION = "eu-west-2"
process.env.S3_REGION = process.env.AWS_REGION
process.env.S3_AWS_ACCESS_KEY_ID = "S3RVER"
process.env.S3_AWS_SECRET_ACCESS_KEY = "S3RVER"
process.env.S3_ENDPOINT = "http://localhost:4566"
process.env.DYNAMO_URL = "http://localhost:8000"
process.env.DYNAMO_REGION = "test"
process.env.PHASE1_COMPARISON_TABLE_NAME = "core-comparison"
process.env.PHASE2_COMPARISON_TABLE_NAME = "core-comparison-phase2"
process.env.PHASE3_COMPARISON_TABLE_NAME = "core-comparison-phase3"
process.env.AWS_ACCESS_KEY_ID = "test"
process.env.AWS_SECRET_ACCESS_KEY = "test"
process.env.MQ_USER = "admin"
process.env.MQ_PASSWORD = "admin"
process.env.MQ_URL = "failover:(stomp://localhost:61613)"
process.env.INCOMING_BUCKET_NAME = "incoming-messages"
process.env.AUDIT_LOG_API_URL = "http://localhost:7010"
process.env.AUDIT_LOG_API_KEY = "dummy"
process.env.PHASE_2_QUEUE_NAME = "TEST_PNC_UPDATE_REQUEST_QUEUE"
process.env.PNC_API_URL = "http://localhost:11000/pnc"
process.env.TASK_DATA_BUCKET_NAME = "conductor-task-data"
process.env.SMTP_HOST = "localhost"
process.env.SMTP_USER = "bichard"
process.env.SMTP_PASSWORD = "password"
process.env.SMTP_PORT = "20002"
process.env.SMTP_TLS = "false"
process.env.SMTP_DEBUG = "false"
