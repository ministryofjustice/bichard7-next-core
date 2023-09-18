import type { ConductorWorker, Task } from "@io-orkes/conductor-javascript"
import getTaskConcurrency from "@moj-bichard7/common/conductor/getTaskConcurrency"
import failed from "@moj-bichard7/common/conductor/helpers/failed"
import failedTerminal from "@moj-bichard7/common/conductor/helpers/failedTerminal"
import { conductorLog, logCompletedMessage, logWorkingMessage } from "@moj-bichard7/common/conductor/logging"
import type ConductorLog from "@moj-bichard7/common/conductor/types/ConductorLog"
import { isError } from "@moj-bichard7/common/types/Result"
import pLimit from "p-limit"
import DynamoGateway from "../lib/DynamoGateway"
import compareFile from "../lib/compareFile"
import createDynamoDbConfig from "../lib/createDynamoDbConfig"
import isPass from "../lib/isPass"
import recordResultsInDynamo from "../lib/recordResultsInDynamo"
import type ComparisonResult from "../types/ComparisonResult"

const dynamoConfig = createDynamoDbConfig()
const gateway = new DynamoGateway(dynamoConfig)
const bucket = process.env.COMPARISON_BUCKET ?? "bichard-7-production-processing-validation"
const taskDefName = "rerun_day"
const s3Concurrency = process.env.S3_CONCURRENCY ? Number(process.env.S3_CONCURRENCY) : 20

const rerunDay: ConductorWorker = {
  taskDefName,
  concurrency: getTaskConcurrency(taskDefName, 1),
  execute: async (task: Task) => {
    logWorkingMessage(task)

    const start = task.inputData?.start
    const end = task.inputData?.end
    const onlyFailures = task.inputData?.onlyFailures ?? false
    const persistResults = task.inputData?.persistResults ?? true
    const newMatcher = task.inputData?.newMatcher ?? true

    process.env.USE_NEW_MATCHER = newMatcher.toString()

    if (!start || !end) {
      return failedTerminal("start and end must be specified")
    }

    const logs: ConductorLog[] = []
    const count = { pass: 0, fail: 0, intentionalDifference: 0, skipped: 0 }

    const successFilter = onlyFailures ? false : undefined

    for await (const batch of gateway.getRange(start, end, successFilter, 1000)) {
      if (!batch || isError(batch)) {
        return failed("Failed to get batch from Dynamo")
      }

      logs.push(conductorLog(`Processing ${batch.length} comparison tests...`))

      const limit = pLimit(s3Concurrency)
      const resultPromises = batch.map(({ s3Path }) => limit(() => compareFile(s3Path, bucket)))
      const allTestResults = await Promise.all(resultPromises)

      allTestResults.forEach((res) => {
        if (isError(res)) {
          logs.push(conductorLog(res.message))
        } else {
          if (res.comparisonResult.intentionalDifference) {
            count.intentionalDifference += 1
          } else if (res.comparisonResult.skipped) {
            count.skipped += 1
          } else if (isPass(res.comparisonResult)) {
            count.pass += 1
          } else {
            count.fail += 1
            logs.push(conductorLog(`Comparison failed: ${res.s3Path}`))
          }
        }
      })

      const nonErrorTestResults = allTestResults.filter((res) => !isError(res)) as ComparisonResult[]

      if (persistResults) {
        const recordResultsInDynamoResult = await recordResultsInDynamo(nonErrorTestResults, gateway)
        if (isError(recordResultsInDynamoResult)) {
          return failed("Failed to write results to Dynamo")
        }
      }

      logs.push(
        conductorLog(
          `Results of processing: ${count.pass} passed. ${count.fail} failed. ${count.intentionalDifference} intentional differences.`
        )
      )
    }

    logCompletedMessage(task)
    return {
      logs,
      outputData: { ...count },
      status: "COMPLETED"
    }
  }
}

export default rerunDay
