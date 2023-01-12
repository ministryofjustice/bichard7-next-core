import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import { ConductorClient, TaskManager } from "@io-orkes/conductor-typescript"
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

// const dynamoConfig = createDynamoDbConfig()
// const gateway = new DynamoGateway(dynamoConfig)

const client = new ConductorClient({
  serverUrl: "http://localhost:5002/api"
})

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

    logs.push(conductorLog(`start date: ${startDate}`))
    logs.push(conductorLog(`end date: ${endDate}`))

    for (const d = new Date(startDate); d <= new Date(endDate); d.setDate(d.getDate() + 1)) {
      const start = d.toISOString()
      const end = new Date(d)
      end.setDate(d.getDate() + 1)
      ranges.push({ start, end: end.toISOString() })
    }

    logs.push(conductorLog(`generated ${ranges.length} intervals`))

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
  execute: (task: Task) => {
    logWorkingMessage(task)
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
