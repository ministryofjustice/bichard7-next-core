process.env.AWS_REGION = "local"
process.env.S3_REGION = process.env.AWS_REGION
process.env.S3_AWS_ACCESS_KEY_ID = "S3RVER"
process.env.S3_AWS_SECRET_ACCESS_KEY = "S3RVER"
process.env.S3_ENDPOINT = "http://localhost:21001"
process.env.DYNAMO_URL = "http://localhost:8000"
process.env.DYNAMO_REGION = "test"
process.env.PHASE1_COMPARISON_TABLE_NAME = "core-comparison"
process.env.PHASE2_COMPARISON_TABLE_NAME = "core-comparison-phase2"
process.env.PHASE3_COMPARISON_TABLE_NAME = "core-comparison-phase3"
process.env.AWS_ACCESS_KEY_ID = "test"
process.env.AWS_SECRET_ACCESS_KEY = "test"
process.env.MQ_USER = "admin"
process.env.MQ_PASSWORD = "admin"
process.env.MQ_URL = "failover:(stomp://localhost:62613)"
process.env.PHASE_1_BUCKET_NAME = "phase-1-bucket"
process.env.AUDIT_LOG_API_URL = "http://localhost:11001"
process.env.AUDIT_LOG_API_KEY = "dummy"
process.env.PHASE_2_QUEUE_NAME = "PNC_UPDATE_REQUEST_QUEUE"
