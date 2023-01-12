import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import { ConductorClient, TaskManager } from "@io-orkes/conductor-typescript"
import getStandingDataVersionByDate from "src/comparison/cli/getStandingDataVersionByDate"
import type { ComparisonResult } from "src/comparison/lib/compareMessage"
import compareMessage from "src/comparison/lib/compareMessage"
import createDynamoDbConfig from "src/comparison/lib/createDynamoDbConfig"
import DynamoGateway from "src/comparison/lib/DynamoGateway"
import getDateFromComparisonFilePath from "src/comparison/lib/getDateFromComparisonFilePath"
import recordResultsInDynamo from "src/comparison/lib/recordResultsInDynamo"
import { isError } from "src/comparison/types/Result"
import createS3Config from "src/lib/createS3Config"
import getFileFromS3 from "src/lib/getFileFromS3"
import type { Task } from "./Task"

type ConductorLog = {
  createdTime?: number
  log?: string
  taskId?: string
}

type Range = {
  start: string
  end: string
}

const conductorLog = (log: string): ConductorLog => ({ log, createdTime: new Date().getTime() })
const logWorkingMessage = (task: Task) => console.log(`working on ${task.taskDefName} (${task.taskId})`)

const dynamoConfig = createDynamoDbConfig()
const s3Config = createS3Config()
const gateway = new DynamoGateway(dynamoConfig)

const client = new ConductorClient({
  serverUrl: "http://localhost:5002/api"
})

const isPass = (result: ComparisonResult): boolean =>
  result.triggersMatch && result.exceptionsMatch && result.xmlOutputMatches && result.xmlParsingMatches

const generateRerunFailuresTasks: ConductorWorker = {
  taskDefName: "generate_rerun_failures_tasks",
  execute: (task: Task) => {
    logWorkingMessage(task)
    const startDate = task.inputData?.startDate ?? "2023-01-01"
    const endDate = task.inputData?.endDate ?? new Date().toISOString()
    const taskName = task.inputData?.taskName

    if (!taskName) {
      return Promise.resolve({
        logs: [conductorLog("taskName must be specified")],
        status: "FAILED_WITH_TERMINAL_ERROR"
      })
    }

    const logs: ConductorLog[] = []
    const ranges: Range[] = []

    for (const d = new Date(startDate); d <= new Date(endDate); d.setDate(d.getDate() + 1)) {
      const start = d.toISOString()
      const end = new Date(d)
      end.setDate(d.getDate() + 1)
      ranges.push({ start, end: end.toISOString() })
    }

    logs.push(conductorLog(`Generated ${ranges.length} day intervals`))

    return Promise.resolve({
      logs,
      outputData: {
        dynamicTasks: ranges.map((_, i) => ({ name: taskName, taskReferenceName: `task${i}` })),
        dynamicTasksInput: ranges.reduce((inputs: { [key: string]: Range }, { start, end }, i) => {
          inputs[`task${i}`] = { start, end }
          return inputs
        }, {})
      },
      status: "COMPLETED"
    })
  }
}

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
        throw recordResultsInDynamoResult
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

const workers = [generateRerunFailuresTasks, rerunFailureDay]
const taskManager = new TaskManager(client, workers)

console.log("Starting polling...")
taskManager.startPolling()
