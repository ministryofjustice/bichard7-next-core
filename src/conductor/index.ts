import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import { ConductorClient, TaskManager } from "@io-orkes/conductor-typescript"
import type { Task } from "./Task"

const conductorLog = (log: string): { log: string; createdTime: number } => ({ log, createdTime: new Date().getTime() })

// const dynamoConfig = createDynamoDbConfig()
// const gateway = new DynamoGateway(dynamoConfig)

const client = new ConductorClient({
  serverUrl: "http://localhost:5002/api"
})

const generateRerunFailuresTasks: ConductorWorker = {
  taskDefName: "generate_rerun_failures_tasks",
  execute: (task: Task) => {
    console.log(`working on generate_rerun_failures_tasks (${task.taskId})`)

    return Promise.resolve({
      outputData: {
        dynamicTasks: [
          { name: task.inputData?.taskName, taskReferenceName: "task1" },
          { name: task.inputData?.taskName, taskReferenceName: "task2" },
          { name: task.inputData?.taskName, taskReferenceName: "task3" },
          { name: task.inputData?.taskName, taskReferenceName: "task4" },
          { name: task.inputData?.taskName, taskReferenceName: "task5" }
        ],
        dynamicTasksInput: {
          task1: { start: "2023-01-01", end: "2023-01-02" },
          task2: { start: "2023-01-02", end: "2023-01-03" },
          task3: { start: "2023-01-03", end: "2023-01-04" },
          task4: { start: "2023-01-04", end: "2023-01-05" },
          task5: { start: "2023-01-05", end: "2023-01-06" }
        }
      },
      status: "COMPLETED"
    })
  }
}

const rerunFailureDay: ConductorWorker = {
  taskDefName: "rerun_failure_day",
  execute: (task: Task) => {
    console.log(`working on rerun_failure_day (${task.taskId})`)
    return Promise.resolve({
      logs: [conductorLog(`Processing from ${task.inputData?.start} to ${task.inputData?.end}`)],
      status: "COMPLETED"
    })
  }
}

const workers = [generateRerunFailuresTasks, rerunFailureDay]
const taskManager = new TaskManager(client, workers)

console.log("Starting polling...")
taskManager.startPolling()
