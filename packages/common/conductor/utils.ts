import type ConductorLog from "conductor/types/ConductorLog"
import type Task from "conductor/types/Task"
import logger from "utils/logger"

export const conductorLog = (log: string): ConductorLog => ({ log, createdTime: new Date().getTime() })

export const logWorkingMessage = (task: Task) => logger.debug(`working on ${task.taskDefName} (${task.taskId})`)

export const logCompletedMessage = (task: Task) =>
  logger.debug(`completed working on ${task.taskDefName} (${task.taskId})`)
