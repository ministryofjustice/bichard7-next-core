import { ConductorClient, TaskManager } from "@io-orkes/conductor-javascript"
import logger from "@moj-bichard7/common/utils/logger"
import persistPhase1 from "@moj-bichard7/core/conductor-tasks/bichard_phase_1/persistPhase1"
import processPhase1 from "@moj-bichard7/core/conductor-tasks/bichard_phase_1/processPhase1"
import sendToPhase2 from "@moj-bichard7/core/conductor-tasks/bichard_phase_1/sendToPhase2"
import deleteS3File from "@moj-bichard7/core/conductor-tasks/common/deleteS3File"
import storeAuditLogEvents from "@moj-bichard7/core/conductor-tasks/common/storeAuditLogEvents"
import alertCommonPlatform from "@moj-bichard7/core/conductor-tasks/incomingMessageHandler/alertCommonPlatform"
import convertSpiToAho from "@moj-bichard7/core/conductor-tasks/incomingMessageHandler/convertSpiToAho"
import createAuditLogRecord from "@moj-bichard7/core/conductor-tasks/incomingMessageHandler/createAuditLogRecord"
import compareFiles from "@moj-bichard7/core/phase1/comparison/conductor-tasks/compareFiles"
import generateRerunTasks from "@moj-bichard7/core/phase1/comparison/conductor-tasks/generateRerunTasks"
import rerunPeriod from "@moj-bichard7/core/phase1/comparison/conductor-tasks/rerunPeriod"
import { captureWorkerExceptions } from "./captureWorkerExceptions"
import { configureWorker, defaultConcurrency, defaultPollInterval } from "./configureWorker"

const client = new ConductorClient({
  serverUrl: process.env.CONDUCTOR_URL ?? "http://localhost:5002/api",
  USERNAME: process.env.CONDUCTOR_USERNAME,
  PASSWORD: process.env.CONDUCTOR_PASSWORD
})

const tasks = [
  alertCommonPlatform,
  compareFiles,
  convertSpiToAho,
  createAuditLogRecord,
  deleteS3File,
  generateRerunTasks,
  persistPhase1,
  processPhase1,
  rerunPeriod,
  sendToPhase2,
  storeAuditLogEvents
]
  .map(captureWorkerExceptions)
  .map(configureWorker)

const taskManager = new TaskManager(client, tasks, {
  options: { concurrency: defaultConcurrency(), pollInterval: defaultPollInterval() },
  logger
})

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
