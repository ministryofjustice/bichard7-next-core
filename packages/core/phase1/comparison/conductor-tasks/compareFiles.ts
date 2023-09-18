import type { ConductorWorker, Task } from "@io-orkes/conductor-javascript"
import getTaskConcurrency from "@moj-bichard7/common/conductor/getTaskConcurrency"
import failed from "@moj-bichard7/common/conductor/helpers/failed"
import failedTerminal from "@moj-bichard7/common/conductor/helpers/failedTerminal"
import { conductorLog, logCompletedMessage, logWorkingMessage } from "@moj-bichard7/common/conductor/logging"
import type ConductorLog from "@moj-bichard7/common/conductor/types/ConductorLog"
import { isError } from "@moj-bichard7/common/types/Result"
import DynamoGateway from "../lib/DynamoGateway"
import compareFile from "../lib/compareFile"
import createDynamoDbConfig from "../lib/createDynamoDbConfig"
import isPass from "../lib/isPass"
import recordResultsInDynamo from "../lib/recordResultsInDynamo"
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
      return failedTerminal("start and end must be specified")
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
      return failed("Failed to write results to Dynamo")
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
