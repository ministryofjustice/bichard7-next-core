import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import type { ConductorLog } from "conductor/src/types"
import type { Task } from "conductor/src/types/Task"
import { conductorLog, logWorkingMessage } from "conductor/src/utils"
import compareFile from "../lib/compareFile"
import createDynamoDbConfig from "../lib/createDynamoDbConfig"
import DynamoGateway from "../lib/DynamoGateway"
import isPass from "../lib/isPass"
import recordResultsInDynamo from "../lib/recordResultsInDynamo"
import { isError } from "../types"
import type ComparisonResult from "../types/ComparisonResult"

const dynamoConfig = createDynamoDbConfig()
const gateway = new DynamoGateway(dynamoConfig)
const bucket = process.env.COMPARISON_BUCKET ?? "bichard-7-production-processing-validation"

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

      const resultPromises = batch.map(({ s3Path }) => compareFile(s3Path, bucket))

      const allTestResults = await Promise.all(resultPromises)

      allTestResults.forEach((res) => {
        if (isError(res)) {
          logs.push(conductorLog(res.message))
        } else {
          if (isPass(res.comparisonResult)) {
            count.pass += 1
          } else {
            count.fail += 1
            logs.push(conductorLog(`Comparison failed: ${res.s3Path}`))
          }
        }
      })

      const nonErrorTestResults = allTestResults.filter((res) => !isError(res)) as ComparisonResult[]

      const recordResultsInDynamoResult = await recordResultsInDynamo(nonErrorTestResults, gateway)
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
