import type DynamoDB from "aws-sdk/clients/dynamodb"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import type { ComparisonLog } from "../comparison/types"

const config: DynamoDB.ClientConfiguration = {
  endpoint: process.env.DYNAMO_URL ?? "https://dynamodb.eu-west-2.amazonaws.com",
  region: process.env.DYNAMO_REGION ?? "eu-west-2"
}
const client = new DocumentClient(config)

const main = async (skippedBy: string, skippedReason: string, file: string, intentionalDifference?: string) => {
  if (!file || !skippedBy || !skippedReason) {
    console.error("Usage: skip-test.ts <skippedBy> <skippedReason> [intentionalDifference] <file>")
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
  test.intentionalDifference = intentionalDifference === "true"

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

if (process.argv.length === 6) {
  main(process.argv[2], process.argv[3], process.argv[5], process.argv[4])
} else {
  main(process.argv[2], process.argv[3], process.argv[4])
}
