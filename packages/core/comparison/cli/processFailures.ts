import DynamoGateway from "../lib/DynamoGateway"
import createDynamoDbConfig from "../lib/createDynamoDbConfig"
import getDateFromComparisonFilePath from "../lib/getDateFromComparisonFilePath"
import type ComparisonResultDetail from "../types/ComparisonResultDetail"
import fetchFile from "./fetchFile"
import processFile from "./processFile"
import skippedFile from "./skippedFile"

process.env.PHASE1_COMPARISON_TABLE_NAME =
  process.env.PHASE1_COMPARISON_TABLE_NAME ?? "bichard-7-production-comparison-log"
process.env.PHASE2_COMPARISON_TABLE_NAME =
  process.env.PHASE2_COMPARISON_TABLE_NAME ?? "bichard-7-production-phase2-comparison-log"
process.env.PHASE3_COMPARISON_TABLE_NAME =
  process.env.PHASE3_COMPARISON_TABLE_NAME ?? "bichard-7-production-phase3-comparison-log"
process.env.DYNAMO_URL = process.env.DYNAMO_URL ?? "https://dynamodb.eu-west-2.amazonaws.com"
process.env.DYNAMO_REGION = process.env.DYNAMO_REGION ?? "eu-west-2"
process.env.COMPARISON_S3_BUCKET = process.env.COMPARISON_S3_BUCKET ?? "bichard-7-production-processing-validation"

const processFailures = async (phase: number = 2, cache: boolean): Promise<ComparisonResultDetail[]> => {
  const dynamoConfig = createDynamoDbConfig(phase)
  const dynamo = new DynamoGateway(dynamoConfig)
  const results = []
  let count = 0

  for await (const batch of dynamo.getAllFailures(1000)) {
    if (!batch || batch instanceof Error) {
      console.error(batch)
      throw new Error("Error fetching batch from Dynamo")
    }

    count += batch.length

    const filePromises = batch.map((record) => fetchFile(record, cache))
    const files = await Promise.all(filePromises)

    for (const { fileName, contents } of files) {
      if (contents) {
        const date = getDateFromComparisonFilePath(fileName)
        const result = await processFile(contents, fileName, date)
        if (result) {
          results.push(result)
        }
      } else {
        results.push(skippedFile(fileName))
      }
    }

    if (batch.length !== 0) {
      console.log(`Processed ${count} records`)
    }
  }

  return results
}

export default processFailures
