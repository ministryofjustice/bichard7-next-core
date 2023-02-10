import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import type { ConductorLog } from "./types"
import type { Task } from "./types/Task"
import { conductorLog } from "./utils"

const dummyTask: ConductorWorker = {
  taskDefName: "dummy_task",
  execute: (task: Task) => {
    const logs: ConductorLog[] = [
      conductorLog(`Working on ${task.taskDefName} (${task.taskId})`),
      conductorLog("Log one"),
      conductorLog("Log two"),
      conductorLog("Log three")
    ]
    return Promise.resolve({
      logs,
      outputData: {},
      status: "COMPLETED"
    })
  }
}

export default dummyTask
