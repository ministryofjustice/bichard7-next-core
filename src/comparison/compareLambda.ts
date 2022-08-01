import compareMessage from "src/comparison/compareMessage"
import { isError } from "src/comparison/Types"
import logger from "src/lib/logging"
import type { ComparisonResult } from "./compareMessage"
import createDynamoDbConfig from "./createDynamoDbConfig"
import createS3Config from "./createS3Config"
import DynamoGateway from "./DynamoGateway/DynamoGateway"
import getFileFromS3 from "./getFileFromS3"
import logInDynamoDb from "./logInDynamoDb"
import type { CompareLambdaEvent } from "./Types/CompareLambdaEvent"
import { eventSchema } from "./Types/CompareLambdaEvent"

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

  const comparisonResult = compareMessage(content)

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

  return comparisonResult
}
