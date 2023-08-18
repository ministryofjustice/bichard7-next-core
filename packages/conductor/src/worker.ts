import { ConductorClient, TaskManager } from "@io-orkes/conductor-typescript"
import compareFiles from "core/phase1/comparison/workers/compareFiles"
import generateDayTasks from "core/phase1/comparison/workers/generateDayTasks"
import rerunDay from "core/phase1/comparison/workers/rerunDay"
import logger from "core/phase1/lib/logging"
import processPhase1 from "core/phase1/workers/bichard_process/processPhase1"
import readAhoFromDb from "core/phase1/workers/bichard_process/readAhoFromDb"
import sendToPhase2 from "core/phase1/workers/bichard_process/sendToPhase2"
import storeAuditLogEvents from "core/phase1/workers/common/storeAuditLogEvents"
import convertSpiToAho from "core/phase1/workers/incomingMessageHandler/convertSpiToAho"
import { defaultConcurrency } from "packages/conductor/src/getTaskConcurrency"
import { captureWorkerExceptions } from "./utils"

const client = new ConductorClient({
  serverUrl: process.env.CONDUCTOR_URL ?? "http://localhost:5002/api",
  USERNAME: process.env.CONDUCTOR_USERNAME,
  PASSWORD: process.env.CONDUCTOR_PASSWORD
})

const tasks = [
  convertSpiToAho,
  readAhoFromDb,
  generateDayTasks,
  rerunDay,
  compareFiles,
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
