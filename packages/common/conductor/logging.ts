import logger from "../utils/logger"
import type ConductorLog from "./types/ConductorLog"
import type Task from "./types/Task"

export const conductorLog = (log: string): ConductorLog => ({ log, createdTime: new Date().getTime() })

export const logWorkingMessage = (task: Task) => logger.debug(`working on ${task.taskDefName} (${task.taskId})`)

export const logCompletedMessage = (task: Task) =>
  logger.debug(`completed working on ${task.taskDefName} (${task.taskId})`)
