import type { Task } from "@io-orkes/conductor-javascript"
import logger from "../utils/logger"
import type ConductorLog from "./types/ConductorLog"

export const conductorLog = (log: string): ConductorLog => ({ log, createdTime: new Date().getTime() })

export const logWorkingMessage = (task: Task) => logger.debug(`working on ${task.taskDefName} (${task.taskId})`)

export const logCompletedMessage = (task: Task) =>
  logger.debug(`completed working on ${task.taskDefName} (${task.taskId})`)
