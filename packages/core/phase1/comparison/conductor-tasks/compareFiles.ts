import type { ConductorWorker, Task } from "@io-orkes/conductor-javascript"
import completed from "@moj-bichard7/common/conductor/helpers/completed"
import failed from "@moj-bichard7/common/conductor/helpers/failed"
import failedTerminal from "@moj-bichard7/common/conductor/helpers/failedTerminal"
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

const compareFiles: ConductorWorker = {
  taskDefName: "compare_files",
  concurrency: 10,
  pollInterval: 1000,
  execute: async (task: Task) => {
    const records = task.inputData?.records as string[]

    if (!records) {
      return failedTerminal("start and end must be specified")
    }

    const logs: string[] = []
    const count = { pass: 0, fail: 0 }

    const resultPromises = records.map((s3Path) => compareFile(s3Path, bucket))

    const allTestResults = await Promise.all(resultPromises)

    allTestResults.forEach((res) => {
      if (isError(res)) {
        logs.push(res.message)
      } else {
        if (isPass(res.comparisonResult)) {
          count.pass += 1
        } else {
          count.fail += 1
          logs.push(`Comparison failed: ${res.s3Path}`)
        }
      }
    })

    const nonErrorTestResults = allTestResults.filter((res) => !isError(res)) as ComparisonResult[]

    const recordResultsInDynamoResult = await recordResultsInDynamo(nonErrorTestResults, gateway)
    if (isError(recordResultsInDynamoResult)) {
      return failed("Failed to write results to Dynamo")
    }

    logs.push(`Results of processing: ${count.pass} passed. ${count.fail} failed`)

    return completed(count, ...logs)
  }
}

export default compareFiles
