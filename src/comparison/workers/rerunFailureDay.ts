import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import type { ConductorLog } from "conductor/src/types"
import type { Task } from "conductor/src/types/Task"
import { conductorLog, logWorkingMessage } from "conductor/src/utils"
import createS3Config from "src/lib/createS3Config"
import getFileFromS3 from "src/lib/getFileFromS3"
import getStandingDataVersionByDate from "../cli/getStandingDataVersionByDate"
import type { ComparisonResult } from "../lib/compareMessage"
import compareMessage from "../lib/compareMessage"
import createDynamoDbConfig from "../lib/createDynamoDbConfig"
import DynamoGateway from "../lib/DynamoGateway"
import getDateFromComparisonFilePath from "../lib/getDateFromComparisonFilePath"
import recordResultsInDynamo from "../lib/recordResultsInDynamo"
import { isError } from "../types"

const s3Config = createS3Config()
const dynamoConfig = createDynamoDbConfig()
const gateway = new DynamoGateway(dynamoConfig)

const isPass = (result: ComparisonResult): boolean =>
  result.triggersMatch && result.exceptionsMatch && result.xmlOutputMatches && result.xmlParsingMatches

const rerunFailureDay: ConductorWorker = {
  taskDefName: "rerun_failure_day",
  execute: async (task: Task) => {
    logWorkingMessage(task)

    const start = task.inputData?.start
    const end = task.inputData?.end

    if (!start || !end) {
      return {
        logs: [conductorLog("taskName must be specified")],
        status: "FAILED_WITH_TERMINAL_ERROR"
      }
    }

    const logs: ConductorLog[] = []
    const count = { pass: 0, fail: 0 }

    for await (const batch of gateway.getRange(start, end, false, 1000)) {
      if (!batch || batch instanceof Error) {
        return {
          logs: [conductorLog("Failed to get batch from Dynamo")],
          status: "FAILED"
        }
      }

      logs.push(conductorLog(`Processing ${batch.length} comparison tests...`))

      const resultPromises = batch.map(async (test) => {
        const testLogs: ConductorLog[] = []
        const bucket = "bichard-7-production-processing-validation"
        const s3Path = test.s3Path

        const content = await getFileFromS3(s3Path, bucket, s3Config)
        if (content instanceof Error) {
          throw content
        }

        let comparisonResult: ComparisonResult
        let error: Error | undefined
        const date = getDateFromComparisonFilePath(s3Path)
        try {
          comparisonResult = await compareMessage(content, false, {
            defaultStandingDataVersion: getStandingDataVersionByDate(date)
          })
        } catch (e) {
          error = e as Error
          testLogs.push(conductorLog(error.message))
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
          testLogs.push(conductorLog(`Comparison failed: ${s3Path}`))
        }

        if (error) {
          testLogs.push(conductorLog(error.message))
        }

        return { s3Path, comparisonResult, logs: testLogs }
      })

      const allTestResults = await Promise.all(resultPromises)

      const allTestLogs = allTestResults.reduce((accumulatedLogs: ConductorLog[], testResult) => {
        return accumulatedLogs.concat(testResult.logs)
      }, [])

      logs.push(...allTestLogs)

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

export default rerunFailureDay
