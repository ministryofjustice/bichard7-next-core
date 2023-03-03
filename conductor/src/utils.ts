import type { ConductorLog } from "conductor/src/types"
import type { Task } from "conductor/src/types/Task"

export const conductorLog = (log: string): ConductorLog => ({ log, createdTime: new Date().getTime() })
export const logWorkingMessage = (task: Task) => console.log(`working on ${task.taskDefName} (${task.taskId})`)
export const logCompletedMessage = (task: Task) =>
  console.log(`completed working on ${task.taskDefName} (${task.taskId})`)
