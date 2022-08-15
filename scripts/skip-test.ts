import type DynamoDB from "aws-sdk/clients/dynamodb"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import type ComparisonLog from "src/comparison/Types/ComparisonLog"

const config: DynamoDB.ClientConfiguration = {
  endpoint: process.env.DYNAMO_URL ?? "https://dynamodb.eu-west-2.amazonaws.com",
  region: process.env.DYNAMO_REGION ?? "eu-west-2"
}
const client = new DocumentClient(config)

const main = async (file: string, skippedBy: string, skippedReason: string) => {
  if (!file || !skippedBy || !skippedReason) {
    console.error("Usage: skip-test.ts <file> <skippedBy> <skippedReason>")
    return
  }

  const tableName = process.env.COMPARISON_TABLE ?? "bichard-7-production-comparison-log"
  const key = file.replace("s3://bichard-7-production-processing-validation/", "")

  const existing = await client
    .get({
      TableName: tableName,
      Key: { s3Path: key }
    })
    .promise()

  const test = existing.Item as ComparisonLog

  const existingVersion = test.version
  test.version += 1
  test.skipped = true
  test.skippedBy = skippedBy
  test.skippedReason = skippedReason

  await client
    .put({
      TableName: tableName,
      Item: test,
      ConditionExpression: "attribute_exists(version) and version = :version",
      ExpressionAttributeValues: {
        ":version": existingVersion
      }
    })
    .promise()
}

main(process.argv[2], process.argv[3], process.argv[4])
