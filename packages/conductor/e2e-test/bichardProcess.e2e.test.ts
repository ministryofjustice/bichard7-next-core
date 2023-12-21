import "./helpers/setEnvironmentVariables"

import AuditLogApiClient from "@moj-bichard7/common/AuditLogApiClient/AuditLogApiClient"
import { completeWaitingTask, startWorkflow } from "@moj-bichard7/common/conductor/conductorApi"
import createConductorConfig from "@moj-bichard7/common/conductor/createConductorConfig"
import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import createMqConfig from "@moj-bichard7/common/mq/createMqConfig"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import getFileFromS3 from "@moj-bichard7/common/s3/getFileFromS3"
import { createAuditLogRecord } from "@moj-bichard7/common/test/audit-log-api/createAuditLogRecord"
import { waitForCompletedWorkflow } from "@moj-bichard7/common/test/conductor/waitForCompletedWorkflow"
import { waitForHumanTask } from "@moj-bichard7/common/test/conductor/waitForHumanTask"
import MqListener from "@moj-bichard7/common/test/mq/listener"
import { clearPncMocks } from "@moj-bichard7/common/test/pnc/clearPncMocks"
import { uploadPncMock } from "@moj-bichard7/common/test/pnc/uploadPncMock"
import { putIncomingMessageToS3 } from "@moj-bichard7/common/test/s3/putIncomingMessageToS3"
import { type AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import { randomUUID } from "crypto"
import fs from "fs"
import postgres from "postgres"
import onlyTriggersPncMock from "./fixtures/only-triggers-aho.pnc.json"
import successExceptionsPncMock from "./fixtures/success-exceptions-aho.pnc.json"
import successNoTriggersPncMock from "./fixtures/success-no-triggers-aho.pnc.json"

const TASK_DATA_BUCKET_NAME = "conductor-task-data"
const s3Config = createS3Config()
const conductorConfig = createConductorConfig()
const auditLogClient = new AuditLogApiClient("http://localhost:7010", "test")

const dbConfig = createDbConfig()
const db = postgres(dbConfig)
const mqConfig = createMqConfig()

const getAuditLogs = async (correlationId: string) => {
  const auditLog = await auditLogClient.getMessage(correlationId)
  if (isError(auditLog)) {
    throw new Error("Error retrieving audit log")
  }
  return auditLog.events.map((e) => e.eventCode)
}

describe("bichard_process workflow", () => {
  let mqListener: MqListener
  let correlationId: string
  let s3TaskDataPath: string

  beforeAll(() => {
    mqListener = new MqListener(mqConfig)
    mqListener.listen("TEST_PHASE2_QUEUE")
  })

  afterAll(() => {
    db.end()
    mqListener.stop()
  })

  beforeEach(async () => {
    correlationId = randomUUID()
    s3TaskDataPath = `${randomUUID()}.json`

    await clearPncMocks()
    mqListener.clearMessages()

    await createAuditLogRecord(correlationId)
  })

  it("should store audit logs and send to phase 2 if there are no triggers or exceptions", async () => {
    await putIncomingMessageToS3("e2e-test/fixtures/success-no-triggers-aho.json", s3TaskDataPath, correlationId)
    await uploadPncMock(successNoTriggersPncMock)
    await startWorkflow("bichard_process", { s3TaskDataPath }, correlationId, conductorConfig)
    await waitForCompletedWorkflow(s3TaskDataPath)

    // Make sure it hasn't been persisted
    const dbResult = await db`SELECT count(*) from br7own.error_list WHERE message_id = ${correlationId}`
    expect(dbResult[0]).toHaveProperty("count", "0")

    // Check the correct audit logs are in place
    const auditLogEventCodes = await getAuditLogs(correlationId)
    expect(auditLogEventCodes).toContain("hearing-outcome.received-phase-1")
    expect(auditLogEventCodes).toContain("hearing-outcome.submitted-phase-2")

    // Check the message was sent to the message queue
    expect(mqListener.messages).toHaveLength(1)
    expect(mqListener.messages[0]).toMatch(correlationId)

    // Check the temp file has been cleaned up
    const s3File = await getFileFromS3(s3TaskDataPath, TASK_DATA_BUCKET_NAME!, s3Config, 1)
    expect(isError(s3File)).toBeTruthy()
    expect((s3File as Error).message).toBe("The specified key does not exist.")
  })

  it("should persist the record and send to phase 2 if there are triggers but no exceptions", async () => {
    await putIncomingMessageToS3("e2e-test/fixtures/only-triggers-aho.json", s3TaskDataPath, correlationId)
    await uploadPncMock(onlyTriggersPncMock)
    await startWorkflow("bichard_process", { s3TaskDataPath }, correlationId, conductorConfig)
    await waitForCompletedWorkflow(s3TaskDataPath)

    // Make sure it has been persisted
    const dbResult = await db`SELECT count(*) from br7own.error_list
                                    WHERE message_id = ${correlationId}
                                    AND trigger_count = 3 AND error_count = 0`
    expect(dbResult[0]).toHaveProperty("count", "1")

    // Check the correct audit logs are in place
    const auditLogEventCodes = await getAuditLogs(correlationId)
    expect(auditLogEventCodes).toContain("hearing-outcome.received-phase-1")
    expect(auditLogEventCodes).toContain("hearing-outcome.submitted-phase-2")

    // Check the message was sent to the message queue
    expect(mqListener.messages).toHaveLength(1)
    expect(mqListener.messages[0]).toMatch(correlationId)

    // Check the temp file has been cleaned up
    const s3File = await getFileFromS3(s3TaskDataPath, TASK_DATA_BUCKET_NAME!, s3Config, 1)
    expect(isError(s3File)).toBeTruthy()
    expect((s3File as Error).message).toBe("The specified key does not exist.")
  })

  it("should store audit logs and stop processing if the message is ignored", async () => {
    await putIncomingMessageToS3("e2e-test/fixtures/ignored-aho.json", s3TaskDataPath, correlationId)
    await startWorkflow("bichard_process", { s3TaskDataPath }, correlationId, conductorConfig)
    await waitForCompletedWorkflow(s3TaskDataPath)

    // Make sure it hasn't been persisted
    const dbResult = await db`SELECT count(*) from br7own.error_list WHERE message_id = ${correlationId}`
    expect(dbResult[0]).toHaveProperty("count", "0")

    // Check the correct audit logs are in place
    const auditLogEventCodes = await getAuditLogs(correlationId)
    expect(auditLogEventCodes).toContain("hearing-outcome.received-phase-1")

    // Check the temp file has been cleaned up
    const s3File = await getFileFromS3(s3TaskDataPath, TASK_DATA_BUCKET_NAME!, s3Config, 1)
    expect(isError(s3File)).toBeTruthy()
    expect((s3File as Error).message).toBe("The specified key does not exist.")
  })

  it("should wait for and process a resubmission if there are exceptions", async () => {
    await putIncomingMessageToS3("e2e-test/fixtures/success-exceptions-aho.json", s3TaskDataPath, correlationId)
    await uploadPncMock(successExceptionsPncMock)
    const workflowId = await startWorkflow("bichard_process", { s3TaskDataPath }, correlationId, conductorConfig)
    const task = await waitForHumanTask(correlationId, conductorConfig)

    // Make sure it has been persisted
    const dbResult = await db`SELECT count(*) from br7own.error_list
                                    WHERE message_id = ${correlationId}
                                    AND trigger_count = 2 AND error_count = 2`
    expect(dbResult[0]).toHaveProperty("count", "1")

    // Update database record with new AHO XML
    const updatedAho = String(fs.readFileSync("e2e-test/fixtures/success-exceptions-aho-resubmitted.xml")).replace(
      "CORRELATION_ID",
      correlationId
    )
    await db`UPDATE br7own.error_list SET updated_msg = ${updatedAho} WHERE message_id = ${correlationId}`

    // Mark the human task as complete
    await completeWaitingTask(workflowId, task.taskId, conductorConfig)
    await waitForCompletedWorkflow(s3TaskDataPath)

    // Check the message was sent to the message queue
    expect(mqListener.messages).toHaveLength(1)
    expect(mqListener.messages[0]).toMatch(correlationId)

    // Check the correct audit logs are in place
    const auditLogEventCodes = await getAuditLogs(correlationId)
    expect(auditLogEventCodes).toContain("hearing-outcome.received-phase-1")
    expect(auditLogEventCodes).toContain("hearing-outcome.submitted-phase-2")

    // Check the temp file has been cleaned up
    const s3File = await getFileFromS3(s3TaskDataPath, TASK_DATA_BUCKET_NAME!, s3Config, 1)
    expect(isError(s3File)).toBeTruthy()
    expect((s3File as Error).message).toBe("The specified key does not exist.")
  })

  it("should store audit logs if the record is manually resolved", async () => {
    await putIncomingMessageToS3("e2e-test/fixtures/success-exceptions-aho.json", s3TaskDataPath, correlationId)
    await uploadPncMock(successExceptionsPncMock)
    const workflowId = await startWorkflow("bichard_process", { s3TaskDataPath }, correlationId, conductorConfig)
    const task = await waitForHumanTask(correlationId, conductorConfig)

    // Make sure it has been persisted
    const dbResult = await db`SELECT count(*) from br7own.error_list
                                    WHERE message_id = ${correlationId}
                                    AND trigger_count = 2 AND error_count = 2`
    expect(dbResult[0]).toHaveProperty("count", "1")

    // Mark the human task as manually resolved
    const auditLog: AuditLogEvent = {
      eventCode: EventCode.ExceptionsResolved,
      eventType: "Exceptions were manually resolved",
      category: EventCategory.information,
      eventSource: "test",
      timestamp: new Date()
    }
    await completeWaitingTask(workflowId, task.taskId, conductorConfig, {
      status: "manually_resolved",
      auditLogEvents: [auditLog]
    })
    await waitForCompletedWorkflow(s3TaskDataPath)

    // Check the message was not sent to the message queue
    expect(mqListener.messages).toHaveLength(0)

    // Check the correct audit logs are in place
    const auditLogEventCodes = await getAuditLogs(correlationId)
    expect(auditLogEventCodes).toContain("hearing-outcome.received-phase-1")
    expect(auditLogEventCodes).toContain(EventCode.ExceptionsResolved)

    // Check the temp file has been cleaned up
    const s3File = await getFileFromS3(s3TaskDataPath, TASK_DATA_BUCKET_NAME!, s3Config, 1)
    expect(isError(s3File)).toBeTruthy()
    expect((s3File as Error).message).toBe("The specified key does not exist.")
  })
})
