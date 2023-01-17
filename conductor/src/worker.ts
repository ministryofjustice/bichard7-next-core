import { ConductorClient, TaskManager } from "@io-orkes/conductor-typescript"
import generateDayTasks from "src/comparison/workers/generateDayTasks"
import rerunDay from "src/comparison/workers/rerunDay"

const client = new ConductorClient({
  serverUrl: process.env.CONDUCTOR_URL ?? "http://localhost:5002/api",
  USERNAME: process.env.CONDUCTOR_USERNAME,
  PASSWORD: process.env.CONDUCTOR_PASSWORD
})

const workers = [generateDayTasks, rerunDay]
const taskManager = new TaskManager(client, workers)

console.log("Starting polling...")
taskManager.startPolling()
