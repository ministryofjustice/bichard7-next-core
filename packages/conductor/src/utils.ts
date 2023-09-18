import type { ConductorWorker, Task } from "@io-orkes/conductor-javascript"
import failed from "@moj-bichard7/common/conductor/helpers/failed"
import logger from "@moj-bichard7/common/utils/logger"

export const captureWorkerExceptions = (worker: ConductorWorker): ConductorWorker => ({
  ...worker,
  execute: (task: Task) => {
    try {
      return worker.execute(task)
    } catch (e) {
      const message = `Exception caught in ${worker.taskDefName}: ${(e as Error).message}`
      logger.error(message)
      return failed(message)
    }
  }
})
