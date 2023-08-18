import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import getTaskConcurrency from "packages/conductor/src/getTaskConcurrency"
import type { ConductorLog } from "packages/conductor/src/types"
import type { Task } from "packages/conductor/src/types/Task"
import { conductorLog, logCompletedMessage, logWorkingMessage } from "packages/conductor/src/utils"
const taskDefName = "generate_day_tasks"

export type GenerateDayTasksOutput = {
  start: string
  end: string
  onlyFailures: boolean
  persistResults: boolean
  newMatcher: boolean
}

const generateDayTasks: ConductorWorker = {
  taskDefName,
  concurrency: getTaskConcurrency(taskDefName),
  execute: (task: Task) => {
    logWorkingMessage(task)
    const startDate = new Date(task.inputData?.startDate ?? "2022-07-01")
    const endDate = new Date(task.inputData?.endDate ?? new Date().toISOString())
    const onlyFailures = task.inputData?.onlyFailures ?? false
    const taskName = task.inputData?.taskName
    const persistResults = task.inputData?.persistResults ?? true
    const newMatcher = task.inputData?.newMatcher ?? true

    if (!taskName) {
      return Promise.resolve({
        logs: [conductorLog("taskName must be specified")],
        status: "FAILED_WITH_TERMINAL_ERROR"
      })
    }

    const logs: ConductorLog[] = []
    const ranges: GenerateDayTasksOutput[] = []

    for (const d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const start = d.toISOString()
      let end = new Date(d)
      end.setDate(d.getDate() + 1)
      if (end > endDate) {
        end = endDate
      }
      ranges.push({ start, end: end.toISOString(), onlyFailures, persistResults, newMatcher })
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
