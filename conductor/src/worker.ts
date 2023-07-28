import { ConductorClient, TaskManager } from "@io-orkes/conductor-typescript"
import { defaultConcurrency } from "conductor/src/getTaskConcurrency"
import compareFiles from "src/comparison/workers/compareFiles"
import generateDayTasks from "src/comparison/workers/generateDayTasks"
import rerunDay from "src/comparison/workers/rerunDay"
import logger from "src/lib/logging"
import processPhase1 from "src/workers/phase1/processPhase1"
import sendToPhase2 from "src/workers/phase1/sendToPhase2"
import storeAuditLogEvents from "src/workers/phase1/storeAuditLogEvents"
import storeInQuarantineBucket from "src/workers/phase1/storeInQuarantineBucket"
import { captureWorkerExceptions } from "./utils"

const client = new ConductorClient({
  serverUrl: process.env.CONDUCTOR_URL ?? "http://localhost:5002/api",
  USERNAME: process.env.CONDUCTOR_USERNAME,
  PASSWORD: process.env.CONDUCTOR_PASSWORD
})

const tasks = [
  generateDayTasks,
  rerunDay,
  compareFiles,
  processPhase1,
  sendToPhase2,
  storeAuditLogEvents,
  storeInQuarantineBucket
].map(captureWorkerExceptions)

const taskManager = new TaskManager(client, tasks, { options: { concurrency: defaultConcurrency } })

logger.info("Starting polling...")

const signalHandler = (signal: string) => {
  logger.info(`${signal} signal received.`)
  taskManager.stopPolling()
}

process.on("SIGINT", signalHandler)
process.on("SIGTERM", signalHandler)
process.on("SIGQUIT", signalHandler)

process.on("exit", (code) => {
  logger.info("Exiting gracefully with code: ", code)
})

taskManager.startPolling()
