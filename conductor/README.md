# Conductor

## Creating a new queue in localstack

```
AWS_SECRET_ACCESS_KEY="FAKE" AWS_ACCESS_KEY_ID="FAKE" AWS_DEFAULT_REGION=us-east-1 aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name comparisonQueue
```

## Sending a new message

```
AWS_SECRET_ACCESS_KEY="FAKE" AWS_ACCESS_KEY_ID="FAKE" AWS_DEFAULT_REGION=us-east-1 aws --endpoint-url http://localhost:4566 sqs send-message --queue-url http://localhost:4566/000000000000/comparisonQueue --message-body file://test-data/conductor/sqs-new-message-notification.json
```

## Running the worker locally

```
DYNAMO_AWS_ACCESS_KEY_ID=FAKE DYNAMO_AWS_SECRET_ACCESS_KEY=FAKE S3_AWS_ACCESS_KEY_ID=FAKE S3_AWS_SECRET_ACCESS_KEY=FAKE S3_ENDPOINT=http://localhost:4566 COMPARISON_BUCKET=comparisons CONDUCTOR_USERNAME=bichard CONDUCTOR_PASSWORD=password PHASE1_COMPARISON_TABLE_NAME=bichard-7-production-comparison-log PHASE2_COMPARISON_TABLE_NAME=bichard-7-production-phase2-comparison-log PHASE3_COMPARISON_TABLE_NAME=bichard-7-production-phase3-comparison-log DYNAMO_REGION=eu-west-2 DYNAMO_URL=http://localhost:4566 npm run conductor-worker
```
