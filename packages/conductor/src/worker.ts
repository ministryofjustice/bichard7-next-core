import { TaskManager } from "@io-orkes/conductor-javascript"
import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"
import logger from "@moj-bichard7/common/utils/logger"
import persistPhase1 from "@moj-bichard7/core/conductor-tasks/bichard_phase_1/persistPhase1"
import processPhase1 from "@moj-bichard7/core/conductor-tasks/bichard_phase_1/processPhase1"
import sendToPhase2 from "@moj-bichard7/core/conductor-tasks/bichard_phase_1/sendToPhase2"
import persistPhase2 from "@moj-bichard7/core/conductor-tasks/bichard_phase_2/persistPhase2"
import processPhase2 from "@moj-bichard7/core/conductor-tasks/bichard_phase_2/processPhase2"
import sendToPhase3 from "@moj-bichard7/core/conductor-tasks/bichard_phase_2/sendToPhase3"
import persistPhase3 from "@moj-bichard7/core/conductor-tasks/bichard_phase_3/persistPhase3"
import processPhase3 from "@moj-bichard7/core/conductor-tasks/bichard_phase_3/processPhase3"
import deleteS3File from "@moj-bichard7/core/conductor-tasks/common/deleteS3File"
import lockS3File from "@moj-bichard7/core/conductor-tasks/common/lockS3File"
import storeAuditLogEvents from "@moj-bichard7/core/conductor-tasks/common/storeAuditLogEvents"
import alertCommonPlatform from "@moj-bichard7/core/conductor-tasks/incomingMessageHandler/alertCommonPlatform"
import convertSpiToAho from "@moj-bichard7/core/conductor-tasks/incomingMessageHandler/convertSpiToAho"
import createAuditLogRecord from "@moj-bichard7/core/conductor-tasks/incomingMessageHandler/createAuditLogRecord"
import checkDb from "@moj-bichard7/core/conductor-tasks/resubmit/check_db"

import { captureWorkerExceptions } from "./captureWorkerExceptions"
import { configureWorker, defaultConcurrency, defaultPollInterval } from "./configureWorker"

const client = createConductorClient()
const tasks = [
  alertCommonPlatform,
  convertSpiToAho,
  createAuditLogRecord,
  deleteS3File,
  lockS3File,
  persistPhase1,
  persistPhase2,
  persistPhase3,
  processPhase1,
  processPhase2,
  processPhase3,
  sendToPhase2,
  sendToPhase3,
  storeAuditLogEvents,
  checkDb
]
  .map(captureWorkerExceptions)
  .map(configureWorker)

const taskManager = new TaskManager(client, tasks, {
  logger,
  options: { concurrency: defaultConcurrency(), pollInterval: defaultPollInterval() }
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
  logger.info("Exiting gracefully with code: %d", code)
})

taskManager.startPolling()
