# Conductor

## Creating a new queue in localstack

```
AWS_SECRET_ACCESS_KEY="FAKE" AWS_ACCESS_KEY_ID="FAKE" AWS_DEFAULT_REGION=us-east-1 aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name comparisonQueue
```

## Sending a new message

```
AWS_SECRET_ACCESS_KEY="FAKE" AWS_ACCESS_KEY_ID="FAKE" AWS_DEFAULT_REGION=us-east-1 aws --endpoint-url http://localhost:4566 sqs send-message --queue-url http://localhost:4566/000000000000/comparisonQueue --message-body file://test-data/conductor/sqs-new-message-notification.json
```
