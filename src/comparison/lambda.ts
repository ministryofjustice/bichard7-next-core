import { isError } from "src/comparison/Types"
import compare from "src/comparison/compare"
import { z } from "zod"
import type { ComparisonResult } from "./compare"
import createDynamoDbConfig from "./createDynamoDbConfig"
import createS3Config from "./createS3Config"
import DynamoGateway from "./DynamoGateway/DynamoGateway"
import getFileFromS3 from "./getFileFromS3"

const s3Config = createS3Config()
const dynamoDbGatewayConfig = createDynamoDbConfig()
const dynamoGateway = new DynamoGateway(dynamoDbGatewayConfig)
const tableName = process.env.COMPARISON_TABLE_NAME
if (!tableName) {
  throw new Error("COMPARISON_TABLE_NAME environment variable is mandatory")
}

const inputSchema = z.object({
  detail: z.object({
    bucket: z.object({ name: z.string() }),
    object: z.object({ key: z.string() })
  })
})

export default async (event: unknown): Promise<ComparisonResult> => {
  const parsedEvent = inputSchema.parse(event)

  const bucket = parsedEvent.detail.bucket.name
  const s3Path = parsedEvent.detail.object.key

  console.log(`Retrieving file from S3: ${s3Path}`)
  const content = await getFileFromS3(s3Path, bucket, s3Config)
  if (content instanceof Error) {
    throw content
  }

  const comparisonResult = compare(content)

  const latestResult =
    comparisonResult.triggersMatch &&
    comparisonResult.exceptionsMatch &&
    comparisonResult.xmlOutputMatches &&
    comparisonResult.xmlParsingMatches
      ? 1
      : 0

  const getOneResult = await dynamoGateway.getOne(tableName, "s3Path", s3Path)

  if (isError(getOneResult)) {
    throw getOneResult
  }

  const date = new Date()
  const record = getOneResult?.Item ?? {
    s3Path,
    initialRunAt: date.toISOString(),
    initialResult: latestResult,
    history: [],
    version: 1
  }

  record.latestRunAt = date.toISOString()
  record.latestResult = latestResult

  record.history.push({
    runAt: date.toISOString(),
    result: record.latestResult,
    details: {
      triggersMatch: comparisonResult.triggersMatch ? 1 : 0,
      exceptionsMatch: comparisonResult.exceptionsMatch ? 1 : 0,
      xmlOutputMatches: comparisonResult.xmlOutputMatches ? 1 : 0,
      xmlParsingMatches: comparisonResult.xmlParsingMatches ? 1 : 0
    }
  })

  if (getOneResult?.Item) {
    const updateResult = await dynamoGateway.updateOne(tableName, record, "s3Path", record.version)
    if (isError(updateResult)) {
      throw updateResult
    }
  } else {
    const insertResult = await dynamoGateway.insertOne(tableName, record, "s3Path")
    if (isError(insertResult)) {
      throw insertResult
    }
  }

  return comparisonResult
}
