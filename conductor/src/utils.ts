import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import type { ConductorLog } from "conductor/src/types"
import type { Task } from "conductor/src/types/Task"
import logger from "src/lib/logging"

export const conductorLog = (log: string): ConductorLog => ({ log, createdTime: new Date().getTime() })
export const logWorkingMessage = (task: Task) => logger.debug(`working on ${task.taskDefName} (${task.taskId})`)
export const logCompletedMessage = (task: Task) =>
  logger.debug(`completed working on ${task.taskDefName} (${task.taskId})`)

export const captureWorkerExceptions = (worker: ConductorWorker): ConductorWorker => ({
  ...worker,
  execute: (task: Task) => {
    try {
      return worker.execute(task)
    } catch (e) {
      const message = `Exception caught in ${worker.taskDefName}: ${(e as Error).message}`
      logger.error(message)
      return Promise.resolve({
        logs: [conductorLog(message)],
        status: "FAILED"
      })
    }
  }
})
