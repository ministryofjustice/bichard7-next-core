import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import { conductorLog } from "@moj-bichard7/common/conductor/logging"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import logger from "@moj-bichard7/common/utils/logger"

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
