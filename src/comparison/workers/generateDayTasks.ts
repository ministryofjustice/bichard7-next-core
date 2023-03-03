import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import type { ConductorLog } from "conductor/src/types"
import type { Task } from "conductor/src/types/Task"
import { conductorLog, logCompletedMessage, logWorkingMessage } from "conductor/src/utils"

export type GenerateDayTasksOutput = {
  start: string
  end: string
  onlyFailures: boolean
}

const generateDayTasks: ConductorWorker = {
  taskDefName: "generate_day_tasks",
  execute: (task: Task) => {
    logWorkingMessage(task)
    const startDate = task.inputData?.startDate ?? "2023-01-01"
    const endDate = task.inputData?.endDate ?? new Date().toISOString()
    const onlyFailures = task.inputData?.onlyFailures ?? false
    const taskName = task.inputData?.taskName

    if (!taskName) {
      return Promise.resolve({
        logs: [conductorLog("taskName must be specified")],
        status: "FAILED_WITH_TERMINAL_ERROR"
      })
    }

    const logs: ConductorLog[] = []
    const ranges: GenerateDayTasksOutput[] = []

    for (const d = new Date(startDate); d <= new Date(endDate); d.setDate(d.getDate() + 1)) {
      const start = d.toISOString()
      const end = new Date(d)
      end.setDate(d.getDate() + 1)
      ranges.push({ start, end: end.toISOString(), onlyFailures })
    }

    logs.push(conductorLog(`Generated ${ranges.length} day intervals`))

    logCompletedMessage(task)
    return Promise.resolve({
      logs,
      outputData: {
        dynamicTasks: ranges.map((_, i) => ({ name: taskName, taskReferenceName: `task${i}` })),
        dynamicTasksInput: ranges.reduce((inputs: { [key: string]: GenerateDayTasksOutput }, taskInput, i) => {
          inputs[`task${i}`] = taskInput
          return inputs
        }, {})
      },
      status: "COMPLETED"
    })
  }
}

export default generateDayTasks
