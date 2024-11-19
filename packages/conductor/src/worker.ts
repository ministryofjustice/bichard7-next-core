import { TaskManager } from "@io-orkes/conductor-javascript"
import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"
import logger from "@moj-bichard7/common/utils/logger"
import compareFiles from "@moj-bichard7/core/comparison/conductor-tasks/compareFiles"
import generateRerunTasks from "@moj-bichard7/core/comparison/conductor-tasks/generateRerunTasks"
import rerunPeriod from "@moj-bichard7/core/comparison/conductor-tasks/rerunPeriod"
import persistPhase1 from "@moj-bichard7/core/conductor-tasks/bichard_phase_1/persistPhase1"
import processPhase1 from "@moj-bichard7/core/conductor-tasks/bichard_phase_1/processPhase1"
import sendToPhase2 from "@moj-bichard7/core/conductor-tasks/bichard_phase_1/sendToPhase2"
import deleteS3File from "@moj-bichard7/core/conductor-tasks/common/deleteS3File"
import lockS3File from "@moj-bichard7/core/conductor-tasks/common/lockS3File"
import storeAuditLogEvents from "@moj-bichard7/core/conductor-tasks/common/storeAuditLogEvents"
import alertCommonPlatform from "@moj-bichard7/core/conductor-tasks/incomingMessageHandler/alertCommonPlatform"
import convertSpiToAho from "@moj-bichard7/core/conductor-tasks/incomingMessageHandler/convertSpiToAho"
import createAuditLogRecord from "@moj-bichard7/core/conductor-tasks/incomingMessageHandler/createAuditLogRecord"
import { captureWorkerExceptions } from "./captureWorkerExceptions"
import { configureWorker, defaultConcurrency, defaultPollInterval } from "./configureWorker"
import persistPhase2 from "@moj-bichard7/core/conductor-tasks/bichard_phase_2/persistPhase2"
import processPhase2 from "@moj-bichard7/core/conductor-tasks/bichard_phase_2/processPhase2"
import sendToPhase3 from "@moj-bichard7/core/conductor-tasks/bichard_phase_2/sendToPhase3"

const client = createConductorClient()
const tasks = [
  alertCommonPlatform,
  compareFiles,
  convertSpiToAho,
  createAuditLogRecord,
  deleteS3File,
  generateRerunTasks,
  lockS3File,
  persistPhase1,
  persistPhase2,
  processPhase1,
  processPhase2,
  rerunPeriod,
  sendToPhase2,
  sendToPhase3,
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
