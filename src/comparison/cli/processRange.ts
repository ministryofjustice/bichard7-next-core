import DynamoGateway from "../DynamoGateway/DynamoGateway"
import type { ComparisonResult } from "../lib/compareMessage"
import createDynamoDbConfig from "../lib/createDynamoDbConfig"
import getDateFromComparisonFilePath from "../lib/getDateFromComparisonFilePath"
import getFile from "../lib/getFile"
import processFile from "./processFile"

process.env.COMPARISON_TABLE_NAME = process.env.COMPARISON_TABLE_NAME ?? "bichard-7-production-comparison-log"
process.env.DYNAMO_URL = process.env.DYNAMO_URL ?? "https://dynamodb.eu-west-2.amazonaws.com"
process.env.DYNAMO_REGION = process.env.DYNAMO_REGION ?? "eu-west-2"
process.env.COMPARISON_S3_BUCKET = process.env.COMPARISON_S3_BUCKET ?? "bichard-7-production-processing-validation"

const dynamoConfig = createDynamoDbConfig()

const skippedFile = (file: string): ComparisonResult => ({
  file,
  skipped: true,
  triggersMatch: false,
  exceptionsMatch: false,
  xmlOutputMatches: false,
  xmlParsingMatches: false
})

type FileLookup = {
  fileName: string
  contents?: string
}

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

  const filePromises = records.map(async (record): Promise<FileLookup> => {
    const skip = !!record.skipped
    const s3Url = `s3://${process.env.COMPARISON_S3_BUCKET}/${record.s3Path}`
    if (skip) {
      return { fileName: s3Url }
    }
    const contents = await getFile(s3Url, cache)
    return { fileName: s3Url, contents }
  })

  const files = await Promise.all(filePromises)

  const results = []
  for (const { fileName, contents } of files) {
    if (contents) {
      const date = getDateFromComparisonFilePath(fileName)
      results.push(processFile(contents, fileName, date))
    } else {
      results.push(skippedFile(fileName))
    }
  }
  return results
}

export default processRange
