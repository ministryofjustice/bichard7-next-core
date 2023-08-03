import { ConductorClient, TaskManager } from "@io-orkes/conductor-typescript"
import { defaultConcurrency } from "conductor/src/getTaskConcurrency"
import logger from "src/lib/logging"
import processPhase1 from "src/workers/bichard_process/processPhase1"
import readAhoFromDb from "src/workers/bichard_process/readAhoFromDb"
import storeAuditLogEvents from "src/workers/common/storeAuditLogEvents"
import convertSpiToAho from "src/workers/incomingMessageHandler/convertSpiToAho"
import sendToPhase2 from "src/workers/phase1/sendToPhase2"
import { captureWorkerExceptions } from "./utils"

const client = new ConductorClient({
  serverUrl: process.env.CONDUCTOR_URL ?? "http://localhost:5002/api",
  USERNAME: process.env.CONDUCTOR_USERNAME,
  PASSWORD: process.env.CONDUCTOR_PASSWORD
})

const tasks = [
  convertSpiToAho,
  readAhoFromDb,
  // generateDayTasks,
  // rerunDay,
  // compareFiles,
  processPhase1,
  sendToPhase2,
  storeAuditLogEvents
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
