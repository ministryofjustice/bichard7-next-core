#!/bin/bash
AWS_REGION=eu-west-2
COMPARISON_QUEUE="comparisonQueue"
COMPARISON_BUCKET="comparisons"

# Create the comparison queue
awslocal sqs create-queue --region $AWS_REGION --queue-name $COMPARISON_QUEUE

# Create the incoming message bucket
awslocal s3 mb s3://$COMPARISON_BUCKET

# Configure the incoming messages bucket to push to SQS on create
awslocal s3api put-bucket-notification-configuration \
  --bucket $COMPARISON_BUCKET \
  --region $AWS_REGION \
  --notification-configuration  '{
                                    "QueueConfigurations": [
                                      {
                                        "QueueArn": "arn:aws:sqs:'"$AWS_REGION"':000000000000:'"$COMPARISON_QUEUE"'",
                                        "Events": ["s3:ObjectCreated:*"]
                                      }
                                    ]
                                  }'

DYNAMO_TABLES=( "bichard-7-production-comparison-log" "bichard-7-phase2-production-comparison-log" "bichard-7-phase3-production-comparison-log" )

for TABLE in "${DYNAMO_TABLES[@]}"
do
awslocal dynamodb create-table --region $AWS_REGION --table-name $TABLE \
  --attribute-definitions '[{ "AttributeName": "s3Path", "AttributeType": "S" },
    { "AttributeName": "_", "AttributeType": "S" },
    { "AttributeName": "initialRunAt", "AttributeType": "S" },
    { "AttributeName": "initialResult", "AttributeType": "N" },
    { "AttributeName": "latestRunAt", "AttributeType": "S" },
    { "AttributeName": "latestResult", "AttributeType": "N" }]' \
  --key-schema '[{ "AttributeName": "s3Path", "KeyType": "HASH" }]' \
  --billing-mode PAY_PER_REQUEST \
  --global-secondary-indexes '[
    {
      "IndexName": "initialRunAtIndex",
      "Projection": { "ProjectionType": "ALL" },
      "KeySchema": [
        {"AttributeName": "_", "KeyType": "HASH"},
        {"AttributeName": "initialRunAt", "KeyType": "RANGE"}
      ]
    },
    {
      "IndexName": "initialResultByDateIndex",
      "Projection": { "ProjectionType": "ALL" },
      "KeySchema": [
        {"AttributeName": "initialResult", "KeyType": "HASH"},
        {"AttributeName": "initialRunAt", "KeyType": "RANGE"}
      ]
    },
    {
      "IndexName": "latestRunAtIndex",
      "Projection": { "ProjectionType": "ALL" },
      "KeySchema": [
        {"AttributeName": "_", "KeyType": "HASH"},
        {"AttributeName": "latestRunAt", "KeyType": "RANGE"}
      ]
    },
    {
      "IndexName": "latestResultByDateIndex",
      "Projection": { "ProjectionType": "ALL" },
      "KeySchema": [
        {"AttributeName": "latestResult", "KeyType": "HASH"},
        {"AttributeName": "initialRunAt", "KeyType": "RANGE"}
      ]
    }
  ]'
done
