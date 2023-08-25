import createDynamoDbConfig from "../lib/createDynamoDbConfig"
import DynamoGateway from "../lib/DynamoGateway"
import getDateFromComparisonFilePath from "../lib/getDateFromComparisonFilePath"
import fetchFile from "./fetchFile"

process.env.PHASE1_COMPARISON_TABLE_NAME =
  process.env.PHASE1_COMPARISON_TABLE_NAME ?? "bichard-7-production-comparison-log"
process.env.PHASE2_COMPARISON_TABLE_NAME =
  process.env.PHASE2_COMPARISON_TABLE_NAME ?? "bichard-7-production-phase2-comparison-log"
process.env.PHASE3_COMPARISON_TABLE_NAME =
  process.env.PHASE3_COMPARISON_TABLE_NAME ?? "bichard-7-production-phase3-comparison-log"
process.env.DYNAMO_URL = process.env.DYNAMO_URL ?? "https://dynamodb.eu-west-2.amazonaws.com"
process.env.DYNAMO_REGION = process.env.DYNAMO_REGION ?? "eu-west-2"
process.env.COMPARISON_S3_BUCKET = process.env.COMPARISON_S3_BUCKET ?? "bichard-7-production-processing-validation"

const dynamoConfig = createDynamoDbConfig()

type ProcessFunction<T> = (contents: string, fileName: string, date: Date) => Promise<T | undefined>

export type SkippedFile = {
  file: string
  skipped: true
  intentionalDifference?: boolean
}

const processRange = async <T>(
  start: string,
  end: string,
  filter: string,
  cache: boolean,
  list: boolean,
  processFunction: ProcessFunction<T>
): Promise<(T | SkippedFile)[]> => {
  const dynamo = new DynamoGateway(dynamoConfig)
  const filterValue = filter === "failure" ? false : filter == "success" ? true : undefined
  const results: (T | SkippedFile)[] = []
  let count = 0

  for await (const batch of dynamo.getRange(start, end, filterValue, 1000, true)) {
    if (!batch || batch instanceof Error) {
      console.error(batch)
      throw new Error("Error fetching batch from Dynamo")
    }

    count += batch.length

    const filePromises = batch.map(async (record) => ({ file: await fetchFile(record, cache), record }))
    const files = await Promise.all(filePromises)

    for (const {
      file: { contents, fileName },
      record
    } of files) {
      if (record.intentionalDifference) {
        results.push({ file: fileName, skipped: true, intentionalDifference: true })
      } else if (contents) {
        const date = getDateFromComparisonFilePath(fileName)
        const result = await processFunction(contents, fileName, date)
        if (result) {
          results.push(result)
        }
      } else {
        results.push({ file: fileName, skipped: true })
      }
    }

    if (batch.length !== 0 && !list) {
      console.log(`Processed ${count} records`)
    }
  }

  return results
}

export default processRange
