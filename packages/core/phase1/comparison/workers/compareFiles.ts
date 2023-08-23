import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import getTaskConcurrency from "@moj-bichard7/common/conductor/getTaskConcurrency"
import type ConductorLog from "@moj-bichard7/common/conductor/types/ConductorLog"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import { conductorLog, logCompletedMessage, logWorkingMessage } from "@moj-bichard7/common/conductor/utils"
import { isError } from "@moj-bichard7/common/types/Result"
import DynamoGateway from "phase1/comparison/lib/DynamoGateway"
import compareFile from "phase1/comparison/lib/compareFile"
import createDynamoDbConfig from "phase1/comparison/lib/createDynamoDbConfig"
import isPass from "phase1/comparison/lib/isPass"
import recordResultsInDynamo from "phase1/comparison/lib/recordResultsInDynamo"
import type ComparisonResult from "phase1/comparison/types/ComparisonResult"

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
