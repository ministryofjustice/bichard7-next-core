import type { ComparisonResult } from "src/comparison/compare"
import createDynamoDbConfig from "src/comparison/createDynamoDbConfig"
import DynamoGateway from "src/comparison/DynamoGateway/DynamoGateway"
import processFile from "./processFile"

process.env.COMPARISON_TABLE_NAME = process.env.COMPARISON_TABLE_NAME ?? "bichard-7-production-comparison-log"
process.env.DYNAMO_URL = process.env.DYNAMO_URL ?? "https://dynamodb.eu-west-2.amazonaws.com"
process.env.DYNAMO_REGION = process.env.DYNAMO_REGION ?? "eu-west-2"
process.env.COMPARISON_S3_BUCKET = process.env.COMPARISON_S3_BUCKET ?? "bichard-7-production-processing-validation"

const dynamoConfig = createDynamoDbConfig()

const processRange = async (
  start: string,
  end: string,
  filter: string,
  cache: boolean
): Promise<ComparisonResult[]> => {
  const dynamo = new DynamoGateway(dynamoConfig)
  const filterValue = filter === "failure" ? false : filter == "success" ? true : undefined
  const records = await dynamo.getRange(start, end, filterValue)

  if (!records || records instanceof Error) {
    console.error(records)
    throw new Error("Error fetching records from Dynamo")
  }

  const resultsPromises = records.map((record) => {
    const s3Url = `s3://${process.env.COMPARISON_S3_BUCKET}/${record.s3Path}`
    return processFile(s3Url, cache)
  })
  return Promise.all(resultsPromises)
}

export default processRange
