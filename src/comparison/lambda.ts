import compare from "src/comparison/compare"
import { z } from "zod"
import type { ComparisonResult } from "./compare"
import createDynamoDbConfig from "./createDynamoDbConfig"
import createS3Config from "./createS3Config"
import DynamoGateway from "./DynamoGateway/DynamoGateway"
import getFileFromS3 from "./getFileFromS3"
import type { ComparisonLog } from "./Types"

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

  const date = new Date()
  const record: ComparisonLog = {
    s3Path,
    initialRunAt: date.toISOString(),
    initialResult: 1,
    latestRunAt: date.toISOString(),
    latestResult: 1,
    history: [
      {
        runAt: date.toISOString(),
        result: 1,
        details: {
          triggersMatch: comparisonResult.triggersMatch ? 1 : 0,
          exceptionsMatch: comparisonResult.exceptionsMatch ? 1 : 0,
          xmlOutputMatches: comparisonResult.xmlOutputMatches ? 1 : 0,
          xmlParsingMatches: comparisonResult.xmlParsingMatches ? 1 : 0
        }
      }
    ]
  }

  await dynamoGateway.insertOne(tableName, record, "s3Path")

  return comparisonResult
}
