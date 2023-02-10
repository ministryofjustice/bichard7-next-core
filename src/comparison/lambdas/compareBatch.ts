import { parseComparisonFile } from "tests/helpers/processTestFile"
import createS3Config from "../../lib/createS3Config"
import getFileFromS3 from "../../lib/getFileFromS3"
import logger from "../../lib/logging"
import getStandingDataVersionByDate from "../cli/getStandingDataVersionByDate"
import { isPhase1 } from "../lib/checkPhase"
import compareMessage from "../lib/comparePhase1"
import createDynamoDbConfig from "../lib/createDynamoDbConfig"
import DynamoGateway from "../lib/DynamoGateway"
import getDateFromComparisonFilePath from "../lib/getDateFromComparisonFilePath"
import recordResultsInDynamo from "../lib/recordResultsInDynamo"
import { formatXmlDiffAsTxt } from "../lib/xmlOutputComparison"
import { isError } from "../types"
import type { CompareBatchLambdaEvent } from "../types/CompareLambdaEvent"
import { batchEventSchema } from "../types/CompareLambdaEvent"
import type ComparisonResultDetail from "../types/ComparisonResultDetail"

const s3Config = createS3Config()
const dynamoDbGatewayConfig = createDynamoDbConfig()
const dynamoGateway = new DynamoGateway(dynamoDbGatewayConfig)

const isPass = (result: ComparisonResultDetail): boolean =>
  result.triggersMatch && result.exceptionsMatch && result.xmlOutputMatches && result.xmlParsingMatches

const printDebug = (result: ComparisonResultDetail) => {
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

const failResult: ComparisonResultDetail = {
  triggersMatch: false,
  exceptionsMatch: false,
  xmlOutputMatches: false,
  xmlParsingMatches: false
}

export default async (event: CompareBatchLambdaEvent): Promise<ComparisonResultDetail[]> => {
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

    let comparisonResult = failResult
    let error: Error | undefined
    const date = getDateFromComparisonFilePath(s3Path)
    const comparison = parseComparisonFile(content)
    const correlationId = "correlationId" in comparison ? comparison.correlationId : undefined
    const phase = "phase" in comparison ? comparison.phase : 1
    try {
      if (isPhase1(comparison)) {
        comparisonResult = await compareMessage(comparison, debug, {
          defaultStandingDataVersion: getStandingDataVersionByDate(date)
        })
      }
    } catch (e) {
      error = e as Error
      logger.error(error)
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

    return { s3Path, phase, correlationId, comparisonResult }
  })

  const results = await Promise.all(resultPromises)

  const recordResultsInDynamoResult = await recordResultsInDynamo(results, dynamoGateway)
  if (isError(recordResultsInDynamoResult)) {
    throw recordResultsInDynamoResult
  }

  logger.info(`Results of processing: ${count.pass} passed. ${count.fail} failed`)
  return results.map((result) => result.comparisonResult)
}
