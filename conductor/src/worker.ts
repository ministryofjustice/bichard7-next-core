import { ConductorClient, TaskManager } from "@io-orkes/conductor-typescript"
import generateRerunFailuresTasks from "src/comparison/workers/generateRerunFailuresTasks"
import rerunFailureDay from "src/comparison/workers/rerunFailureDay"

const client = new ConductorClient({
  serverUrl: process.env.CONDUCTOR_URL ?? "http://localhost:5002/api"
})

const workers = [generateRerunFailuresTasks, rerunFailureDay]
const taskManager = new TaskManager(client, workers)

console.log("Starting polling...")
taskManager.startPolling()
