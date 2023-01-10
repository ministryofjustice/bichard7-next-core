import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import { ConductorClient, TaskManager } from "@io-orkes/conductor-typescript"
import https from "https"
import createDynamoDbConfig from "src/comparison/lib/createDynamoDbConfig"
import DynamoGateway from "src/comparison/lib/DynamoGateway"
import { isError } from "src/comparison/types"
import type { Task } from "./Task"

const conductorLog = (log: string): { log: string; createdTime: number } => ({ log, createdTime: new Date().getTime() })

const allS3Paths = [...Array(50).keys()].map((i) => `path/to/file/${i}.json`)

const dynamoConfig = createDynamoDbConfig()
const gateway = new DynamoGateway(dynamoConfig)

const client = new ConductorClient({
  serverUrl: "https://localhost:5001/api",
  AGENT: new https.Agent({
    rejectUnauthorized: false
  })
})

const compareBatchWorker: ConductorWorker = {
  taskDefName: "compare_batch",
  execute: async (task: Task) => {
    const s3Paths = task.inputData?.s3Paths ?? []
    console.log("working on compare_batch")
    await new Promise((resolve) => setTimeout(resolve, 10_000))
    return {
      logs: [conductorLog(`working on ${s3Paths.join(",")}`)],
      status: "COMPLETED"
    }
  }
}

const rerunAllWorker: ConductorWorker = {
  taskDefName: "rerun_all",
  execute: (task: Task) => {
    const startKey = task.inputData?.startKey ?? 0
    const nextKey = startKey + 5
    console.log("working on rerun_all")
    return Promise.resolve({
      logs: [conductorLog(`starting at ${startKey}`)],
      outputData: {
        nextKey: nextKey > allS3Paths.length ? null : nextKey,
        s3Paths: allS3Paths.slice(startKey, startKey + 5)
      },
      status: "COMPLETED"
    })
  }
}

const rerunFailuresWorker: ConductorWorker = {
  taskDefName: "rerun_failures",
  execute: async (task: Task) => {
    console.log("working on rerun_all")
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
        s3Paths: allS3Paths.slice(startKey, startKey + 5)
      },
      status: "COMPLETED"
    }
  }
}

const workers = [compareBatchWorker, rerunAllWorker, rerunFailuresWorker]
const taskManager = new TaskManager(client, workers)

console.log("Starting polling...")
taskManager.startPolling()
