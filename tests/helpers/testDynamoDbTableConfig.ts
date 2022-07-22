import type * as dynamodb from "@aws-sdk/client-dynamodb"

const testDynamoDbTableConfig: dynamodb.CreateTableCommandInput = {
  TableName: process.env.COMPARISON_TABLE_NAME,
  KeySchema: [{ AttributeName: "s3Path", KeyType: "HASH" }],
  AttributeDefinitions: [
    { AttributeName: "s3Path", AttributeType: "S" },
    { AttributeName: "s3Path", AttributeType: "S" }
  ],
  BillingMode: "PAY_PER_REQUEST"
}

export default testDynamoDbTableConfig
