import type * as dynamodb from "@aws-sdk/client-dynamodb"

// Should be kept in sync with "comparison_log_dynamodb_table" in
// bichard7-next-infrastructure.git/terraform/stack_data_storage/main.tf

const testDynamoDbTableConfig: dynamodb.CreateTableCommandInput = {
  TableName: process.env.PHASE1_COMPARISON_TABLE_NAME,
  AttributeDefinitions: [
    { AttributeName: "s3Path", AttributeType: "S" },
    { AttributeName: "_", AttributeType: "S" },
    { AttributeName: "initialRunAt", AttributeType: "S" },
    { AttributeName: "initialResult", AttributeType: "N" },
    { AttributeName: "latestRunAt", AttributeType: "S" },
    { AttributeName: "latestResult", AttributeType: "N" }
  ],
  KeySchema: [{ AttributeName: "s3Path", KeyType: "HASH" }],
  GlobalSecondaryIndexes: [
    {
      IndexName: "initialRunAtIndex",
      Projection: { ProjectionType: "ALL" },
      KeySchema: [
        {
          AttributeName: "_",
          KeyType: "HASH"
        },
        {
          AttributeName: "initialRunAt",
          KeyType: "RANGE"
        }
      ]
    },
    {
      IndexName: "initialResultByDateIndex",
      Projection: { ProjectionType: "ALL" },
      KeySchema: [
        {
          AttributeName: "initialResult",
          KeyType: "HASH"
        },
        {
          AttributeName: "initialRunAt",
          KeyType: "RANGE"
        }
      ]
    },
    {
      IndexName: "latestRunAtIndex",
      Projection: { ProjectionType: "ALL" },
      KeySchema: [
        {
          AttributeName: "_",
          KeyType: "HASH"
        },
        {
          AttributeName: "latestRunAt",
          KeyType: "RANGE"
        }
      ]
    },
    {
      IndexName: "latestResultByDateIndex",
      Projection: { ProjectionType: "ALL" },
      KeySchema: [
        {
          AttributeName: "latestResult",
          KeyType: "HASH"
        },
        {
          AttributeName: "initialRunAt",
          KeyType: "RANGE"
        }
      ]
    }
  ],
  BillingMode: "PAY_PER_REQUEST"
}

export default testDynamoDbTableConfig
