import type { ConductorWorker, Task } from "@io-orkes/conductor-javascript"
import completed from "@moj-bichard7/common/conductor/helpers/completed"
import failedTerminal from "@moj-bichard7/common/conductor/helpers/failedTerminal"

export type GenerateDayTasksOutput = {
  start: string
  end: string
  onlyFailures: boolean
  persistResults: boolean
  newMatcher: boolean
}

const generateRerunTasks: ConductorWorker = {
  taskDefName: "generate_rerun_tasks",
  pollInterval: 10000,
  execute: (task: Task) => {
    const startDate = new Date(task.inputData?.startDate ?? "2022-07-01")
    const endDate = new Date(task.inputData?.endDate ?? new Date().toISOString())
    const durationSeconds = task.inputData?.durationSeconds ?? 3600
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
      ranges.push({ start, end: end, onlyFailures, persistResults, newMatcher })
    }

    const outputData = {
      dynamicTasks: ranges.map((_, i) => ({ name: taskName, taskReferenceName: `task${i}` })),
      dynamicTasksInput: ranges.reduce((inputs: { [key: string]: GenerateDayTasksOutput }, taskInput, i) => {
        inputs[`task${i}`] = taskInput
        return inputs
      }, {})
    }

    return completed(outputData, `Generated ${ranges.length} day intervals`)
  }
}

export default generateRerunTasks
