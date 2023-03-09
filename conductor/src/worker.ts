import { ConductorClient, TaskManager } from "@io-orkes/conductor-typescript"
import { defaultConcurrency } from "conductor/src/getTaskConcurrency"
import compareFiles from "src/comparison/workers/compareFiles"
import generateDayTasks from "src/comparison/workers/generateDayTasks"
import rerunDay from "src/comparison/workers/rerunDay"
import processPhase1 from "src/workers/phase1/processPhase1"

const client = new ConductorClient({
  serverUrl: process.env.CONDUCTOR_URL ?? "http://localhost:5002/api",
  USERNAME: process.env.CONDUCTOR_USERNAME,
  PASSWORD: process.env.CONDUCTOR_PASSWORD
})

const workers = [generateDayTasks, rerunDay, compareFiles, processPhase1]
const taskManager = new TaskManager(client, workers, { options: { concurrency: defaultConcurrency } })

console.log("Starting polling...")
taskManager.startPolling()
