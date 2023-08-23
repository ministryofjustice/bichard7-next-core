import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import getTaskConcurrency from "@moj-bichard7/common/conductor/getTaskConcurrency"
import { conductorLog } from "@moj-bichard7/common/conductor/logging"
import type Task from "@moj-bichard7/common/conductor/types/Task"

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
