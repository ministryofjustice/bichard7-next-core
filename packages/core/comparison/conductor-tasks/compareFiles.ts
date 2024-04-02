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

    const phase1Results = nonErrorTestResults.filter((res) => res.phase === 1) as ComparisonResult[]
    const phase2Results = nonErrorTestResults.filter((res) => res.phase === 2) as ComparisonResult[]
    const phase3Results = nonErrorTestResults.filter((res) => res.phase === 3) as ComparisonResult[]
    
    const phase1Gateway = new DynamoGateway(createDynamoDbConfig(1))
    const phase2Gateway = new DynamoGateway(createDynamoDbConfig(2))
    const phase3Gateway = new DynamoGateway(createDynamoDbConfig(3))

    const recordPhase1ResultsInDynamoResult = await recordResultsInDynamo(phase1Results, phase1Gateway)
    const recordPhase2ResultsInDynamoResult = await recordResultsInDynamo(phase2Results, phase2Gateway)
    const recordPhase3ResultsInDynamoResult = await recordResultsInDynamo(phase3Results, phase3Gateway)
    
    if (isError(recordPhase1ResultsInDynamoResult)) {
      return failed("Failed to write phase 1 results to Dynamo")
    }

    if (isError(recordPhase2ResultsInDynamoResult)) {
      return failed("Failed to write phase 2 results to Dynamo")
    }

    if (isError(recordPhase3ResultsInDynamoResult)) {
      return failed("Failed to write phase 3 results to Dynamo")
    }

    logs.push(`Results of processing: ${count.pass} passed. ${count.fail} failed`)

    return completed(count, ...logs)
  }
}

export default compareFiles
