import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import type { ConductorLog } from "conductor/src/types"
import type { Task } from "conductor/src/types/Task"
import { conductorLog, logWorkingMessage } from "conductor/src/utils"
import createS3Config from "src/lib/createS3Config"
import getFileFromS3 from "src/lib/getFileFromS3"
import { parseComparisonFile } from "tests/helpers/processTestFile"
import getStandingDataVersionByDate from "../cli/getStandingDataVersionByDate"
import { isPhase1 } from "../lib/checkPhase"
import compareMessage from "../lib/comparePhase1"
import createDynamoDbConfig from "../lib/createDynamoDbConfig"
import DynamoGateway from "../lib/DynamoGateway"
import getDateFromComparisonFilePath from "../lib/getDateFromComparisonFilePath"
import recordResultsInDynamo from "../lib/recordResultsInDynamo"
import { isError } from "../types"
import type ComparisonResult from "../types/ComparisonResult"

const s3Config = createS3Config()
const dynamoConfig = createDynamoDbConfig()
const gateway = new DynamoGateway(dynamoConfig)

const failResult: ComparisonResult = {
  triggersMatch: false,
  exceptionsMatch: false,
  xmlOutputMatches: false,
  xmlParsingMatches: false
}

const isPass = (result: ComparisonResult): boolean =>
  result.triggersMatch && result.exceptionsMatch && result.xmlOutputMatches && result.xmlParsingMatches

const rerunDay: ConductorWorker = {
  taskDefName: "rerun_day",
  execute: async (task: Task) => {
    logWorkingMessage(task)

    const start = task.inputData?.start
    const end = task.inputData?.end
    const onlyFailures = task.inputData?.onlyFailures ?? false

    if (!start || !end) {
      return {
        logs: [conductorLog("start and end must be specified")],
        status: "FAILED_WITH_TERMINAL_ERROR"
      }
    }

    const logs: ConductorLog[] = []
    const count = { pass: 0, fail: 0 }

    const successFilter = onlyFailures ? false : undefined

    for await (const batch of gateway.getRange(start, end, successFilter, 1000)) {
      if (!batch || batch instanceof Error) {
        return {
          logs: [conductorLog("Failed to get batch from Dynamo")],
          status: "FAILED"
        }
      }

      logs.push(conductorLog(`Processing ${batch.length} comparison tests...`))

      const resultPromises = batch.map(async (test) => {
        const bucket = "bichard-7-production-processing-validation"
        const s3Path = test.s3Path

        const content = await getFileFromS3(s3Path, bucket, s3Config)
        if (content instanceof Error) {
          throw content
        }

        const comparison = parseComparisonFile(content)
        const correlationId = "correlationId" in comparison ? comparison.correlationId : undefined
        const phase = "phase" in comparison ? comparison.phase : 1
        let comparisonResult: ComparisonResult = failResult
        let error: Error | undefined
        const date = getDateFromComparisonFilePath(s3Path)
        try {
          if (isPhase1(comparison)) {
            comparisonResult = await compareMessage(comparison, false, {
              defaultStandingDataVersion: getStandingDataVersionByDate(date)
            })
          }
        } catch (e) {
          error = e as Error
          logs.push(conductorLog(error.message))
        }

        if (isPass(comparisonResult)) {
          count.pass += 1
        } else {
          count.fail += 1
          logs.push(conductorLog(`Comparison failed: ${s3Path}`))
        }

        return { s3Path, phase, correlationId, comparisonResult }
      })

      const allTestResults = await Promise.all(resultPromises)

      const recordResultsInDynamoResult = await recordResultsInDynamo(allTestResults, gateway)
      if (isError(recordResultsInDynamoResult)) {
        return {
          logs: [conductorLog("Failed to write results to Dynamo")],
          status: "FAILED"
        }
      }

      logs.push(conductorLog(`Results of processing: ${count.pass} passed. ${count.fail} failed`))
    }

    return {
      logs,
      outputData: { ...count },
      status: "COMPLETED"
    }
  }
}

export default rerunDay
