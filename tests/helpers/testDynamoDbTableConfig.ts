import type * as dynamodb from "@aws-sdk/client-dynamodb"

const testDynamoDbTableConfig: dynamodb.CreateTableCommandInput = {
  TableName: process.env.COMPARISON_TABLE_NAME,
  AttributeDefinitions: [
    { AttributeName: "s3Path", AttributeType: "S" },
    { AttributeName: "latestResult", AttributeType: "N" },
    { AttributeName: "latestRunAt", AttributeType: "S" }
  ],
  KeySchema: [{ AttributeName: "s3Path", KeyType: "HASH" }],
  GlobalSecondaryIndexes: [
    {
      IndexName: "latestResultIndex",
      Projection: { ProjectionType: "ALL" },
      KeySchema: [
        {
          AttributeName: "latestResult",
          KeyType: "HASH"
        },
        {
          AttributeName: "latestRunAt",
          KeyType: "RANGE"
        }
      ]
    }
  ],
  BillingMode: "PAY_PER_REQUEST"
}

export default testDynamoDbTableConfig
