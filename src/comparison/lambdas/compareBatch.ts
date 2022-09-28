import logger from "../../lib/logging"
import getStandingDataVersionByDate from "../cli/getStandingDataVersionByDate"
import type { ComparisonResult } from "../lib/compareMessage"
import compareMessage from "../lib/compareMessage"
import createDynamoDbConfig from "../lib/createDynamoDbConfig"
import createS3Config from "../lib/createS3Config"
import DynamoGateway from "../lib/DynamoGateway"
import getDateFromComparisonFilePath from "../lib/getDateFromComparisonFilePath"
import getFileFromS3 from "../lib/getFileFromS3"
import recordResultsInDynamo from "../lib/recordResultsInDynamo"
import { formatXmlDiffAsTxt } from "../lib/xmlOutputComparison"
import { isError } from "../types"
import type { CompareBatchLambdaEvent } from "../types/CompareLambdaEvent"
import { batchEventSchema } from "../types/CompareLambdaEvent"

const s3Config = createS3Config()
const dynamoDbGatewayConfig = createDynamoDbConfig()
const dynamoGateway = new DynamoGateway(dynamoDbGatewayConfig)

const isPass = (result: ComparisonResult): boolean =>
  result.triggersMatch && result.exceptionsMatch && result.xmlOutputMatches && result.xmlParsingMatches

const printDebug = (result: ComparisonResult) => {
  if (result.debugOutput) {
    if (!result.triggersMatch) {
      logger.error("Triggers do not match")
      logger.error("Core result: ", result.debugOutput.triggers.coreResult)
      logger.error("Bichard result: ", result.debugOutput.triggers.comparisonResult)
    }

    if (!result.exceptionsMatch) {
      logger.error("Exceptions do not match")
      logger.error("Core result: ", result.debugOutput.exceptions.coreResult)
      logger.error("Bichard result: ", result.debugOutput.exceptions.comparisonResult)
    }

    if (!result.xmlOutputMatches) {
      logger.error("XML output from Core does not match")
      console.log(formatXmlDiffAsTxt(result.debugOutput.xmlOutputDiff))
    }

    if (!result.xmlParsingMatches) {
      logger.error("XML parsing does not match")
      console.log(formatXmlDiffAsTxt(result.debugOutput.xmlParsingDiff))
    }
  }
}

export default async (event: CompareBatchLambdaEvent): Promise<ComparisonResult[]> => {
  const parsedEvent = batchEventSchema.parse(Array.isArray(event) ? event : [event])
  const count = { pass: 0, fail: 0 }

  logger.info(`Processing ${parsedEvent.length} comparison tests...`)

  const resultPromises = parsedEvent.map(async (test) => {
    const bucket = test.detail.bucket.name
    const s3Path = test.detail.object.key
    const debug = !!test.detail.debug

    const content = await getFileFromS3(s3Path, bucket, s3Config)
    if (content instanceof Error) {
      throw content
    }

    let comparisonResult: ComparisonResult
    let error: Error | undefined
    const date = getDateFromComparisonFilePath(s3Path)
    try {
      comparisonResult = compareMessage(content, debug, {
        defaultStandingDataVersion: getStandingDataVersionByDate(date)
      })
    } catch (e) {
      error = e as Error
      logger.error(error)
      comparisonResult = {
        triggersMatch: false,
        exceptionsMatch: false,
        xmlOutputMatches: false,
        xmlParsingMatches: false
      }
    }

    if (isPass(comparisonResult)) {
      count.pass += 1
    } else {
      count.fail += 1
      logger.info(`Comparison failed: ${s3Path}`)
      if (debug) {
        printDebug(comparisonResult)
      }
    }

    if (error) {
      logger.info(error)
    }

    return { s3Path, comparisonResult }
  })

  const results = await Promise.all(resultPromises)

  const recordResultsInDynamoResult = await recordResultsInDynamo(results, dynamoGateway)
  if (isError(recordResultsInDynamoResult)) {
    throw recordResultsInDynamoResult
  }

  logger.info(`Results of processing: ${count.pass} passed. ${count.fail} failed`)
  return results.map((result) => result.comparisonResult)
}
