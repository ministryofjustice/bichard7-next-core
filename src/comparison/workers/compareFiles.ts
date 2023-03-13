import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import type { ConductorLog } from "conductor/src/types"
import type { Task } from "conductor/src/types/Task"
import { conductorLog, logCompletedMessage, logWorkingMessage } from "conductor/src/utils"
import getTaskConcurrency from "../../../conductor/src/getTaskConcurrency"
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
const taskDefName = "compare_files"

const compareFiles: ConductorWorker = {
  taskDefName,
  concurrency: getTaskConcurrency(taskDefName, 10),
  execute: async (task: Task) => {
    logWorkingMessage(task)

    const records = task.inputData?.records as string[]

    if (!records) {
      return {
        logs: [conductorLog("start and end must be specified")],
        status: "FAILED_WITH_TERMINAL_ERROR"
      }
    }

    const logs: ConductorLog[] = []
    const count = { pass: 0, fail: 0 }

    const resultPromises = records.map((s3Path) => compareFile(s3Path, bucket))

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

    logCompletedMessage(task)
    return {
      logs,
      outputData: { ...count },
      status: "COMPLETED"
    }
  }
}

export default compareFiles
