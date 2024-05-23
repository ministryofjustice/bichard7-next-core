import "./helpers/setEnvironmentVariables"

import AuditLogApiClient from "@moj-bichard7/common/AuditLogApiClient/AuditLogApiClient"
import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"
import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import createMqConfig from "@moj-bichard7/common/mq/createMqConfig"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import getFileFromS3 from "@moj-bichard7/common/s3/getFileFromS3"
import { createAuditLogRecord } from "@moj-bichard7/common/test/audit-log-api/createAuditLogRecord"
import { waitForCompletedWorkflow } from "@moj-bichard7/common/test/conductor/waitForCompletedWorkflow"
import MqListener from "@moj-bichard7/common/test/mq/listener"
import { clearPncMocks } from "@moj-bichard7/common/test/pnc/clearPncMocks"
import { uploadPncMock } from "@moj-bichard7/common/test/pnc/uploadPncMock"
import { putIncomingMessageToS3 } from "@moj-bichard7/common/test/s3/putIncomingMessageToS3"
import { isError } from "@moj-bichard7/common/types/Result"
import { randomUUID } from "crypto"
import fs from "fs"
import postgres from "postgres"
import ignoredTriggersPncMock from "./fixtures/ignored-aho-triggers.pnc.json"
import onlyTriggersPncMock from "./fixtures/only-triggers-aho.pnc.json"
import successExceptionsPncMock from "./fixtures/success-exceptions-aho.pnc.json"
import successNoTriggersPncMock from "./fixtures/success-no-triggers-aho.pnc.json"

const TASK_DATA_BUCKET_NAME = "conductor-task-data"
const s3Config = createS3Config()
const conductorClient = createConductorClient()
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

const startWorkflow = (s3TaskDataPath: string, correlationId: string) =>
  conductorClient.workflowResource.startWorkflow1("bichard_phase_1", { s3TaskDataPath }, undefined, correlationId)

describe("bichard_phase_1 workflow", () => {
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
    const fixture = String(fs.readFileSync("e2e-test/fixtures/success-no-triggers-aho.json")).replace(
      "CORRELATION_ID",
      correlationId
    )
    await putIncomingMessageToS3(fixture, s3TaskDataPath, correlationId)
    await uploadPncMock(successNoTriggersPncMock)
    await startWorkflow(s3TaskDataPath, correlationId)
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
    const fixture = String(fs.readFileSync("e2e-test/fixtures/only-triggers-aho.json")).replace(
      "CORRELATION_ID",
      correlationId
    )
    await putIncomingMessageToS3(fixture, s3TaskDataPath, correlationId)
    await uploadPncMock(onlyTriggersPncMock)
    await startWorkflow(s3TaskDataPath, correlationId)
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
    const fixture = String(fs.readFileSync("e2e-test/fixtures/ignored-aho.json")).replace(
      "CORRELATION_ID",
      correlationId
    )
    await putIncomingMessageToS3(fixture, s3TaskDataPath, correlationId)
    await startWorkflow(s3TaskDataPath, correlationId)
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

  it("should store triggers if the message is ignored but still has triggers", async () => {
    const fixture = String(fs.readFileSync("e2e-test/fixtures/ignored-aho-triggers.json")).replace(
      "CORRELATION_ID",
      correlationId
    )
    await uploadPncMock(ignoredTriggersPncMock)
    await putIncomingMessageToS3(fixture, s3TaskDataPath, correlationId)
    await startWorkflow(s3TaskDataPath, correlationId)
    await waitForCompletedWorkflow(s3TaskDataPath)

    // Make sure it has been persisted
    const dbResult = await db`SELECT count(*) from br7own.error_list
                                    WHERE message_id = ${correlationId}
                                    AND trigger_count = 1 AND error_count = 0`
    expect(dbResult[0]).toHaveProperty("count", "1")

    // Check the correct audit logs are in place
    const auditLogEventCodes = await getAuditLogs(correlationId)
    expect(auditLogEventCodes).toContain("hearing-outcome.ignored.reopened")
    expect(auditLogEventCodes).toContain("triggers.generated")

    // Check the temp file has been cleaned up
    const s3File = await getFileFromS3(s3TaskDataPath, TASK_DATA_BUCKET_NAME!, s3Config, 1)
    expect(isError(s3File)).toBeTruthy()
    expect((s3File as Error).message).toBe("The specified key does not exist.")
  })

  it("should persist the record and stop if there are exceptions", async () => {
    const fixture = String(fs.readFileSync("e2e-test/fixtures/success-exceptions-aho.json")).replace(
      "CORRELATION_ID",
      correlationId
    )
    await putIncomingMessageToS3(fixture, s3TaskDataPath, correlationId)
    await uploadPncMock(successExceptionsPncMock)
    await startWorkflow(s3TaskDataPath, correlationId)
    await waitForCompletedWorkflow(s3TaskDataPath)

    // Make sure it has been persisted
    const dbResult = await db`SELECT count(*) from br7own.error_list
                                    WHERE message_id = ${correlationId}
                                    AND trigger_count = 2 AND error_count = 2`
    expect(dbResult[0]).toHaveProperty("count", "1")

    // Check the correct audit logs are in place
    const auditLogEventCodes = await getAuditLogs(correlationId)
    expect(auditLogEventCodes).toContain("hearing-outcome.received-phase-1")

    // Check the message was not sent to the message queue
    expect(mqListener.messages).toHaveLength(0)

    // Check the temp file has been cleaned up
    const s3File = await getFileFromS3(s3TaskDataPath, TASK_DATA_BUCKET_NAME!, s3Config, 1)
    expect(isError(s3File)).toBeTruthy()
    expect((s3File as Error).message).toBe("The specified key does not exist.")
  })
})
