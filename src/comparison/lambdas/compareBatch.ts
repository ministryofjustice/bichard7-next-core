import logger from "../../lib/logging"
import type { ComparisonResult } from "../lib/compareMessage"
import compareMessage from "../lib/compareMessage"
import createDynamoDbConfig from "../lib/createDynamoDbConfig"
import createS3Config from "../lib/createS3Config"
import DynamoGateway from "../lib/DynamoGateway"
import getFileFromS3 from "../lib/getFileFromS3"
import logInDynamoDb from "../lib/logInDynamoDb"
import { isError } from "../types"
import type { CompareBatchLambdaEvent } from "../types/CompareLambdaEvent"
import { batchEventSchema } from "../types/CompareLambdaEvent"

const s3Config = createS3Config()
const dynamoDbGatewayConfig = createDynamoDbConfig()
const dynamoGateway = new DynamoGateway(dynamoDbGatewayConfig)

const isPass = (result: ComparisonResult): boolean =>
  result.triggersMatch && result.exceptionsMatch && result.xmlOutputMatches && result.xmlParsingMatches

export default async (event: CompareBatchLambdaEvent): Promise<ComparisonResult[]> => {
  const parsedEvent = batchEventSchema.parse(Array.isArray(event) ? event : [event])
  const count = { pass: 0, fail: 0 }

  logger.info(`Processing ${parsedEvent.length} comparison tests...`)

  const resultPromises = parsedEvent.map(async (test) => {
    const bucket = test.detail.bucket.name
    const s3Path = test.detail.object.key

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

    const logInDynamoDbResult = await logInDynamoDb(s3Path, comparisonResult, dynamoGateway)
    if (isError(logInDynamoDbResult)) {
      throw logInDynamoDbResult
    }

    if (isPass(comparisonResult)) {
      count.pass += 1
    } else {
      count.fail += 1
      logger.info(`Comparison failed: ${s3Path}`)
    }

    if (error) {
      logger.info(error)
    }

    return comparisonResult
  })

  const results = await Promise.all(resultPromises)

  console.info(`Results of processing: ${count.pass} passed. ${count.fail} failed`)
  return results
}
