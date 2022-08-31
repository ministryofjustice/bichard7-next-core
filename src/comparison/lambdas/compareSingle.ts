import logger from "../../lib/logging"
import type { ComparisonResult } from "../lib/compareMessage"
import compareMessage from "../lib/compareMessage"
import createDynamoDbConfig from "../lib/createDynamoDbConfig"
import createS3Config from "../lib/createS3Config"
import DynamoGateway from "../lib/DynamoGateway"
import getFileFromS3 from "../lib/getFileFromS3"
import logInDynamoDb from "../lib/logInDynamoDb"
import { isError } from "../types"
import type { CompareLambdaEvent } from "../types/CompareLambdaEvent"
import { eventSchema } from "../types/CompareLambdaEvent"

const s3Config = createS3Config()
const dynamoDbGatewayConfig = createDynamoDbConfig()
const dynamoGateway = new DynamoGateway(dynamoDbGatewayConfig)

export default async (event: CompareLambdaEvent): Promise<ComparisonResult> => {
  const parsedEvent = eventSchema.parse(event)

  const bucket = parsedEvent.detail.bucket.name
  const s3Path = parsedEvent.detail.object.key

  logger.info(`Retrieving file from S3: ${s3Path}`)
  const content = await getFileFromS3(s3Path, bucket, s3Config)
  if (content instanceof Error) {
    throw content
  }

  let comparisonResult: ComparisonResult
  let error: Error | undefined
  try {
    comparisonResult = compareMessage(content)
  } catch (e) {
    error = e as Error
    comparisonResult = {
      triggersMatch: false,
      exceptionsMatch: false,
      xmlOutputMatches: false,
      xmlParsingMatches: false
    }
  }

  logger.info(`Logging comparison results in DynamoDB: ${s3Path}`)
  const logInDynamoDbResult = await logInDynamoDb(s3Path, comparisonResult, dynamoGateway)
  if (isError(logInDynamoDbResult)) {
    throw logInDynamoDbResult
  }

  logger.info(
    `[Comparison Result] ${
      comparisonResult.triggersMatch &&
      comparisonResult.exceptionsMatch &&
      comparisonResult.xmlOutputMatches &&
      comparisonResult.xmlParsingMatches
        ? "PASS"
        : "FAIL"
    }`
  )

  if (error) {
    logger.info(error)
  }

  return comparisonResult
}
