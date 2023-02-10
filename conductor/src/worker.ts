import { ConductorClient, TaskManager } from "@io-orkes/conductor-typescript"
import compareFiles from "src/comparison/workers/compareFiles"
import generateDayTasks from "src/comparison/workers/generateDayTasks"
import rerunDay from "src/comparison/workers/rerunDay"
import dummyTask from "./dummyTask"

const client = new ConductorClient({
  serverUrl: process.env.CONDUCTOR_URL ?? "http://localhost:5002/api",
  USERNAME: process.env.CONDUCTOR_USERNAME,
  PASSWORD: process.env.CONDUCTOR_PASSWORD
})

const workers = [generateDayTasks, rerunDay, compareFiles, dummyTask]
const taskManager = new TaskManager(client, workers)

console.log("Starting polling...")
taskManager.startPolling()
