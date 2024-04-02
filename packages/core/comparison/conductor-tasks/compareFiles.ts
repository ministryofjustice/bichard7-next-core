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

type ResultRecord = {
  [phase: number]: { pass: number; fail: number }
}

const recordPass = (resultRecord: ResultRecord, phase: number) => {
  if (resultRecord[phase]) {
    resultRecord[phase].pass++
  } else {
    resultRecord[phase] = { pass: 1, fail: 0 }
  }
}

const recordFail = (resultRecord: ResultRecord, phase: number) => {
  if (resultRecord[phase]) {
    resultRecord[phase].fail++
  } else {
    resultRecord[phase] = { pass: 0, fail: 1 }
  }
}

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
    const resultRecord: ResultRecord = {}
    const resultPromises = records.map((s3Path) => compareFile(s3Path, bucket))

    const allTestResults = await Promise.all(resultPromises)

    allTestResults.forEach((res) => {
      if (isError(res)) {
        logs.push(res.message)
      } else {
        if (isPass(res.comparisonResult)) {
          recordPass(resultRecord, res.phase)
        } else {
          recordFail(resultRecord, res.phase)
          logs.push(`Phase ${res.phase} comparison failed: ${res.s3Path}`)
        }
      }
    })

    const nonErrorTestResults = allTestResults.filter((res) => !isError(res)) as ComparisonResult[]

    const phases = [1, 2]

    phases.forEach(async (phase) => {
      const phaseResults = nonErrorTestResults.filter((res) => res.phase === phase) as ComparisonResult[]
      const gateway = new DynamoGateway(createDynamoDbConfig(phase))
      const recordPhaseResults = await recordResultsInDynamo(phaseResults, gateway)
      if (isError(recordPhaseResults)) {
        return failed(`Failed to write phase ${phase} results to Dynamo`)
      }
    })

    logs.push(
      `Results: Phase 1: ${resultRecord["1"]?.pass} passed. ${resultRecord["1"]?.fail} failed. Phase 2: ${resultRecord["2"]?.pass} passed. ${resultRecord["2"]?.fail} failed`
    )

    return completed(resultRecord, ...logs)
  }
}

export default compareFiles
