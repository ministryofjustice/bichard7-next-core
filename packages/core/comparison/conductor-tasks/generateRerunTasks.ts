import type { ConductorWorker, Task } from "@io-orkes/conductor-javascript"

import completed from "@moj-bichard7/common/conductor/helpers/completed"
import failedTerminal from "@moj-bichard7/common/conductor/helpers/failedTerminal"

export type GenerateDayTasksOutput = {
  end: string
  newMatcher: boolean
  onlyFailures: boolean
  persistResults: boolean
  phase: number
  start: string
}

const generateRerunTasks: ConductorWorker = {
  execute: (task: Task) => {
    const startDate = new Date(task.inputData?.startDate ?? "2023-02-08")
    const endDate = new Date(task.inputData?.endDate ?? new Date().toISOString())
    const durationSeconds = task.inputData?.durationSeconds ?? 43200
    const onlyFailures = task.inputData?.onlyFailures ?? false
    const taskName = task.inputData?.taskName
    const persistResults = task.inputData?.persistResults ?? true
    const newMatcher = task.inputData?.newMatcher ?? true
    const phase = task.inputData?.phase ?? 2

    if (!taskName) {
      return failedTerminal("taskName must be specified")
    }

    const ranges: GenerateDayTasksOutput[] = []

    const endMs = endDate.getTime()
    const durationMs = durationSeconds * 1000

    for (let d = startDate.getTime(); d < endMs; d += durationMs) {
      const start = new Date(d).toISOString()
      const end = new Date(d + durationMs > endMs ? endMs : d + durationMs).toISOString()
      ranges.push({ end: end, newMatcher, onlyFailures, persistResults, phase, start })
    }

    const generateTaskReferenceName = (taskNumber: number, startDate: string, endDate: string): string => {
      const removeMilliseconds = (isoString: string) => isoString.replace(/[.]\d+/, "")

      return `Task ${taskNumber} - ${removeMilliseconds(startDate)} to ${removeMilliseconds(endDate)}`
    }

    const outputData = {
      dynamicTasks: ranges.map((range, i) => ({
        name: taskName,
        taskReferenceName: generateTaskReferenceName(i + 1, range.start, range.end)
      })),
      dynamicTasksInput: ranges.reduce((inputs: { [key: string]: GenerateDayTasksOutput }, taskInput, i) => {
        inputs[generateTaskReferenceName(i + 1, taskInput.start, taskInput.end)] = taskInput
        return inputs
      }, {})
    }

    return completed(outputData, `Generated ${ranges.length} tasks`)
  },
  pollInterval: 10000,
  taskDefName: "generate_rerun_tasks"
}

export default generateRerunTasks
