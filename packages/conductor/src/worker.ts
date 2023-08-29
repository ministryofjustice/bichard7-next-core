import { ConductorClient, TaskManager } from "@io-orkes/conductor-typescript"
import { defaultConcurrency } from "@moj-bichard7/common/conductor/getTaskConcurrency"
import logger from "@moj-bichard7/common/utils/logger"
import compareFiles from "@moj-bichard7/core/phase1/comparison/workers/compareFiles"
import generateDayTasks from "@moj-bichard7/core/phase1/comparison/workers/generateDayTasks"
import rerunDay from "@moj-bichard7/core/phase1/comparison/workers/rerunDay"
import processPhase1 from "@moj-bichard7/core/phase1/workers/bichard_process/processPhase1"
import readAhoFromDb from "@moj-bichard7/core/phase1/workers/bichard_process/readAhoFromDb"
import sendToPhase2 from "@moj-bichard7/core/phase1/workers/bichard_process/sendToPhase2"
import storeAuditLogEvents from "@moj-bichard7/core/phase1/workers/common/storeAuditLogEvents"
import convertSpiToAho from "@moj-bichard7/core/phase1/workers/incomingMessageHandler/convertSpiToAho"

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
