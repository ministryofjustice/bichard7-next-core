import type { ComparisonResult } from "../lib/compareMessage"
import createDynamoDbConfig from "../lib/createDynamoDbConfig"
import DynamoGateway from "../lib/DynamoGateway"
import getDateFromComparisonFilePath from "../lib/getDateFromComparisonFilePath"
import getFile from "../lib/getFile"
import type { ComparisonLog } from "../types"
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

const fetchFile = async (record: ComparisonLog, cache: boolean): Promise<FileLookup> => {
  const skip = !!record.skipped
  const s3Url = `s3://${process.env.COMPARISON_S3_BUCKET}/${record.s3Path}`
  if (skip) {
    return { fileName: s3Url }
  }
  const contents = await getFile(s3Url, cache)
  return { fileName: s3Url, contents }
}

const processRange = async (
  start: string,
  end: string,
  filter: string,
  cache: boolean
): Promise<ComparisonResult[]> => {
  const dynamo = new DynamoGateway(dynamoConfig)
  const filterValue = filter === "failure" ? false : filter == "success" ? true : undefined
  const results = []
  let count = 0

  for await (const batch of dynamo.getRange(start, end, filterValue, 100)) {
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
        results.push(processFile(contents, fileName, date))
      } else {
        results.push(skippedFile(fileName))
      }
    }

    console.log(`Processed ${count} records`)
  }

  return results
}

export default processRange
