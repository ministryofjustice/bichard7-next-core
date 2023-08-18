import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import getTaskConcurrency from "packages/conductor/src/getTaskConcurrency"
import type { Task } from "packages/conductor/src/types/Task"
import { conductorLog } from "packages/conductor/src/utils"

const taskDefName = "store_in_quarantine_bucket"

const storeInQuarantineBucket: ConductorWorker = {
  taskDefName,
  concurrency: getTaskConcurrency(taskDefName),
  execute: (_: Task) => {
    return Promise.resolve({
      logs: [conductorLog("Audit logs written to API")],
      status: "COMPLETED"
    })
  }
}

export default storeInQuarantineBucket
