import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import { ConductorClient, TaskManager } from "@io-orkes/conductor-typescript"
import type { Task } from "./Task"

const conductorLog = (log: string): { log: string; createdTime: number } => ({ log, createdTime: new Date().getTime() })

const allS3Paths = [...Array(50).keys()].map((i) => `path/to/file/${i}.json`)

const client = new ConductorClient({
  serverUrl: "http://localhost:8080/api"
})

const compareBatchWorker: ConductorWorker = {
  taskDefName: "compare_batch",
  execute: async (task: Task) => {
    const s3Paths = task.inputData?.s3Paths ?? []
    await new Promise((resolve) => setTimeout(resolve, 10_000))
    console.log("working on compare_batch")
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

const workers = [compareBatchWorker, rerunAllWorker]
const taskManager = new TaskManager(client, workers)

console.log("Starting polling...")
taskManager.startPolling()
