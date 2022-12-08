import createS3Config from "../../lib/createS3Config"
import getFileFromS3 from "../../lib/getFileFromS3"
import logger from "../../lib/logging"
import type { ComparisonResult } from "../lib/compareMessage"
import compareMessage from "../lib/compareMessage"
import createDynamoDbConfig from "../lib/createDynamoDbConfig"
import DynamoGateway from "../lib/DynamoGateway"
import recordResultInDynamo from "../lib/recordResultInDynamo"
import { isError } from "../types"
import type { CompareSingleLambdaEvent } from "../types/CompareLambdaEvent"
import { eventSchema } from "../types/CompareLambdaEvent"

const s3Config = createS3Config()
const dynamoDbGatewayConfig = createDynamoDbConfig()
const dynamoGateway = new DynamoGateway(dynamoDbGatewayConfig)

export default async (event: CompareSingleLambdaEvent): Promise<ComparisonResult> => {
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
    comparisonResult = await compareMessage(content)
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
  const recordResultInDynamoResult = await recordResultInDynamo(s3Path, comparisonResult, dynamoGateway)
  if (isError(recordResultInDynamoResult)) {
    throw recordResultInDynamoResult
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
