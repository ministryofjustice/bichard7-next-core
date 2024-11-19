import type * as dynamodb from "@aws-sdk/client-dynamodb"

// Should be kept in sync with "comparison_log_dynamodb_table" in
// bichard7-next-infrastructure.git/terraform/stack_data_storage/main.tf

const testDynamoDbTableConfig = (tableName: string): dynamodb.CreateTableCommandInput => ({
  AttributeDefinitions: [
    { AttributeName: "s3Path", AttributeType: "S" },
    { AttributeName: "_", AttributeType: "S" },
    { AttributeName: "initialRunAt", AttributeType: "S" },
    { AttributeName: "initialResult", AttributeType: "N" },
    { AttributeName: "latestRunAt", AttributeType: "S" },
    { AttributeName: "latestResult", AttributeType: "N" }
  ],
  BillingMode: "PAY_PER_REQUEST",
  GlobalSecondaryIndexes: [
    {
      IndexName: "initialRunAtIndex",
      KeySchema: [
        {
          AttributeName: "_",
          KeyType: "HASH"
        },
        {
          AttributeName: "initialRunAt",
          KeyType: "RANGE"
        }
      ],
      Projection: { ProjectionType: "ALL" }
    },
    {
      IndexName: "initialResultByDateIndex",
      KeySchema: [
        {
          AttributeName: "initialResult",
          KeyType: "HASH"
        },
        {
          AttributeName: "initialRunAt",
          KeyType: "RANGE"
        }
      ],
      Projection: { ProjectionType: "ALL" }
    },
    {
      IndexName: "latestRunAtIndex",
      KeySchema: [
        {
          AttributeName: "_",
          KeyType: "HASH"
        },
        {
          AttributeName: "latestRunAt",
          KeyType: "RANGE"
        }
      ],
      Projection: { ProjectionType: "ALL" }
    },
    {
      IndexName: "latestResultByDateIndex",
      KeySchema: [
        {
          AttributeName: "latestResult",
          KeyType: "HASH"
        },
        {
          AttributeName: "initialRunAt",
          KeyType: "RANGE"
        }
      ],
      Projection: { ProjectionType: "ALL" }
    }
  ],
  KeySchema: [{ AttributeName: "s3Path", KeyType: "HASH" }],
  TableName: tableName
})

export default testDynamoDbTableConfig
