#!/bin/bash
AWS_REGION=eu-west-2
CONDUCTOR_TASK_DATA_BUCKET="conductor-task-data"
INCOMING_QUEUE="incomingMessageQueue"
INCOMING_BUCKET_NAME="incoming-messages"

# Create the comparison queue
awslocal sqs create-queue --region $AWS_REGION --queue-name $INCOMING_QUEUE --attributes '{"ReceiveMessageWaitTimeSeconds": "20"}'
awslocal sqs create-queue --region $AWS_REGION --queue-name conductor_COMPLETED --attributes '{"ReceiveMessageWaitTimeSeconds": "20"}'
awslocal sqs create-queue --region $AWS_REGION --queue-name conductor_FAILED --attributes '{"ReceiveMessageWaitTimeSeconds": "20"}'

# Create the incoming message bucket
awslocal s3 mb s3://$CONDUCTOR_TASK_DATA_BUCKET
awslocal s3api put-bucket-versioning --bucket $CONDUCTOR_TASK_DATA_BUCKET --versioning-configuration Status=Enabled
awslocal s3 mb s3://$INCOMING_BUCKET_NAME
awslocal s3api put-bucket-versioning --bucket $INCOMING_BUCKET_NAME --versioning-configuration Status=Enabled

awslocal s3api put-bucket-notification-configuration \
  --bucket $INCOMING_BUCKET_NAME \
  --region $AWS_REGION \
  --notification-configuration  '{ "EventBridgeConfiguration": {} }'

awslocal events put-rule --name "S3ObjectCreated" --event-pattern '{
                                                                    "source": ["aws.s3"],
                                                                    "detail-type": ["Object Created"],
                                                                    "detail": {
                                                                      "bucket": {
                                                                        "name": ["'$INCOMING_BUCKET_NAME'"]
                                                                      }
                                                                    }
                                                                  }'
awslocal events put-targets --rule S3ObjectCreated --targets "Id"="1","Arn"="arn:aws:sqs:eu-west-2:000000000000:$INCOMING_QUEUE"

awslocal dynamodb create-table --region $AWS_REGION --table-name auditLogTable \
  --attribute-definitions '[{ "AttributeName": "messageId", "AttributeType": "S" },
    { "AttributeName": "_", "AttributeType": "S" },
    { "AttributeName": "receivedDate", "AttributeType": "S" },
    { "AttributeName": "externalCorrelationId", "AttributeType": "S" },
    { "AttributeName": "messageHash", "AttributeType": "S" },
    { "AttributeName": "status", "AttributeType": "S" },
    { "AttributeName": "caseId", "AttributeType": "S" },
    { "AttributeName": "isSanitised", "AttributeType": "N" },
    { "AttributeName": "nextSanitiseCheck", "AttributeType": "S" }]' \
  --key-schema '[{ "AttributeName": "messageId", "KeyType": "HASH" }]' \
  --billing-mode PAY_PER_REQUEST \
  --global-secondary-indexes '[
    {
      "IndexName": "receivedDateIndex",
      "Projection": { "ProjectionType": "ALL" },
      "KeySchema": [
        {"AttributeName": "_", "KeyType": "HASH"},
        {"AttributeName": "receivedDate", "KeyType": "RANGE"}
      ]
    },
    {
      "IndexName": "externalCorrelationIdIndex",
      "Projection": { "ProjectionType": "ALL" },
      "KeySchema": [
        {"AttributeName": "externalCorrelationId", "KeyType": "HASH"}
      ]
    },
    {
      "IndexName": "messageHashIndex",
      "Projection": { "ProjectionType": "ALL" },
      "KeySchema": [
        {"AttributeName": "messageHash", "KeyType": "HASH"}
      ]
    },
    {
      "IndexName": "statusIndex",
      "Projection": { "ProjectionType": "ALL" },
      "KeySchema": [
        {"AttributeName": "status", "KeyType": "HASH"},
        {"AttributeName": "receivedDate", "KeyType": "RANGE"}
      ]
    },
    {
      "IndexName": "caseIdIndex",
      "Projection": { "ProjectionType": "ALL" },
      "KeySchema": [
        {"AttributeName": "caseId", "KeyType": "HASH"}
      ]
    },
    {
      "IndexName": "isSanitisedIndex",
      "Projection": { "ProjectionType": "ALL" },
      "KeySchema": [
        {"AttributeName": "isSanitised", "KeyType": "HASH"},
        {"AttributeName": "nextSanitiseCheck", "KeyType": "RANGE"}
      ]
    }
  ]'

awslocal dynamodb create-table --region $AWS_REGION --table-name auditLogEventsTable \
  --attribute-definitions '[{ "AttributeName": "_", "AttributeType": "S" },
    { "AttributeName": "_id", "AttributeType": "S" },
    { "AttributeName": "_messageId", "AttributeType": "S" },
    { "AttributeName": "user", "AttributeType": "S" },
    { "AttributeName": "timestamp", "AttributeType": "S" },
    { "AttributeName": "_automationReport", "AttributeType": "N" },
    { "AttributeName": "_topExceptionsReport", "AttributeType": "N" },
    { "AttributeName": "eventCode", "AttributeType": "S" },
    { "AttributeName": "category", "AttributeType": "S" }]' \
  --key-schema '[{ "AttributeName": "_id", "KeyType": "HASH" }]' \
  --billing-mode PAY_PER_REQUEST \
  --global-secondary-indexes '[
    {
      "IndexName": "timestampIndex",
      "Projection": { "ProjectionType": "ALL" },
      "KeySchema": [
        {"AttributeName": "_", "KeyType": "HASH"},
        {"AttributeName": "timestamp", "KeyType": "RANGE"}
      ]
    },
    {
      "IndexName": "messageIdIndex",
      "Projection": { "ProjectionType": "ALL" },
      "KeySchema": [
        {"AttributeName": "_messageId", "KeyType": "HASH"},
        {"AttributeName": "timestamp", "KeyType": "RANGE"}
      ]
    },
    {
      "IndexName": "userIndex",
      "Projection": { "ProjectionType": "ALL" },
      "KeySchema": [
        {"AttributeName": "user", "KeyType": "HASH"},
        {"AttributeName": "timestamp", "KeyType": "RANGE"}
      ]
    },
    {
      "IndexName": "eventCodeIndex",
      "Projection": { "ProjectionType": "ALL" },
      "KeySchema": [
        {"AttributeName": "eventCode", "KeyType": "HASH"},
        {"AttributeName": "timestamp", "KeyType": "RANGE"}
      ]
    },
    {
      "IndexName": "categoryIndex",
      "Projection": { "ProjectionType": "ALL" },
      "KeySchema": [
        {"AttributeName": "category", "KeyType": "HASH"},
        {"AttributeName": "timestamp", "KeyType": "RANGE"}
      ]
    },
    {
      "IndexName": "automationReportIndex",
      "Projection": { "ProjectionType": "ALL" },
      "KeySchema": [
        {"AttributeName": "_messageId", "KeyType": "HASH"},
        {"AttributeName": "_automationReport", "KeyType": "RANGE"}
      ]
    },
    {
      "IndexName": "topExceptionsReportIndex",
      "Projection": { "ProjectionType": "ALL" },
      "KeySchema": [
        {"AttributeName": "_messageId", "KeyType": "HASH"},
        {"AttributeName": "_topExceptionsReport", "KeyType": "RANGE"}
      ]
    }
  ]'
