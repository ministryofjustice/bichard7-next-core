import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import { ConductorClient, TaskManager } from "@io-orkes/conductor-typescript"
import createDynamoDbConfig from "src/comparison/lib/createDynamoDbConfig"
import DynamoGateway from "src/comparison/lib/DynamoGateway"
import { isError } from "src/comparison/types"
import type { Task } from "./Task"

const conductorLog = (log: string): { log: string; createdTime: number } => ({ log, createdTime: new Date().getTime() })

const dynamoConfig = createDynamoDbConfig()
const gateway = new DynamoGateway(dynamoConfig)

const client = new ConductorClient({
  serverUrl: "http://localhost:5002/api"
})

const compareBatchWorker: ConductorWorker = {
  taskDefName: "compare_batch",
  execute: async (task: Task) => {
    const s3Paths = task.inputData?.s3Paths ?? []
    console.log(`working on compare_batch (${task.taskId})`)
    await new Promise((resolve) => setTimeout(resolve, 10))
    return {
      logs: [conductorLog(`working on ${s3Paths.join(",")}`)],
      status: "COMPLETED"
    }
  }
}

const rerunAllWorker: ConductorWorker = {
  taskDefName: "rerun_all",
  execute: async (task: Task) => {
    console.log(`working on rerun_all (${task.taskId})`)
    const startKey = task.inputData?.startKey
    const resultPage = await gateway.getRangePage("0", "3000", { exclusiveStartKey: startKey })

    if (isError(resultPage)) {
      return {
        logs: [conductorLog(resultPage.message)],
        status: "FAILED"
      }
    }

    return {
      logs: [conductorLog(`starting at ${startKey}`)],
      outputData: {
        nextKey: resultPage.lastEvaluatedKey,
        s3Paths: resultPage.records.map((comparisonLog) => comparisonLog.s3Path)
      },
      status: "COMPLETED"
    }
  }
}

const rerunFailuresWorker: ConductorWorker = {
  taskDefName: "rerun_failures",
  execute: async (task: Task) => {
    console.log(`working on rerun_failures (${task.taskId})`)
    const startKey = task.inputData?.startKey
    const resultPage = await gateway.getAllFailuresPage(1000, false, startKey)

    if (isError(resultPage)) {
      return {
        logs: [conductorLog(resultPage.message)],
        status: "FAILED"
      }
    }

    return {
      logs: [conductorLog(`starting at ${startKey}`)],
      outputData: {
        nextKey: resultPage.lastEvaluatedKey,
        s3Paths: resultPage.records.map((comparisonLog) => comparisonLog.s3Path)
      },
      status: "COMPLETED"
    }
  }
}

const workers = [compareBatchWorker, rerunAllWorker, rerunFailuresWorker]
const taskManager = new TaskManager(client, workers)

console.log("Starting polling...")
taskManager.startPolling()
