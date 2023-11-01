import "./helpers/setEnvironmentVariables"

import AuditLogApiClient from "@moj-bichard7/common/AuditLogApiClient/AuditLogApiClient"
import type ConductorConfig from "@moj-bichard7/common/conductor/ConductorConfig"
import { startWorkflow } from "@moj-bichard7/common/conductor/conductorApi"
import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import createMqConfig from "@moj-bichard7/common/mq/createMqConfig"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import getFileFromS3 from "@moj-bichard7/common/s3/getFileFromS3"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import { isError } from "@moj-bichard7/common/types/Result"
import axios from "axios"
import { randomUUID } from "crypto"
import fs from "fs"
import postgres from "postgres"
import MqListener from "./helpers/mqListener"
import waitForWorkflows from "./helpers/waitForWorkflows"

const TASK_DATA_BUCKET_NAME = "conductor-task-data"
const s3Config = createS3Config()
const conductorConfig: ConductorConfig = {
  url: "http://localhost:5002",
  username: "bichard",
  password: "password"
}
const auditLogClient = new AuditLogApiClient("http://localhost:7010", "test")

const dbConfig = createDbConfig()
const db = postgres(dbConfig)

const mqConfig = createMqConfig()

const createAuditLog = (correlationId: string) =>
  auditLogClient.createAuditLog({
    caseId: "dummy",
    messageId: correlationId,
    receivedDate: new Date().toISOString(),
    messageHash: randomUUID(),
    createdBy: "test",
    externalCorrelationId: randomUUID(),
    isSanitised: 0
  })

const putMessageInS3 = async (fixture: string, path: string, correlationId: string) => {
  const inputMessage = String(fs.readFileSync(fixture)).replace("CORRELATION_ID", correlationId)
  await putFileToS3(inputMessage, path, TASK_DATA_BUCKET_NAME!, s3Config)
}

const waitForWorkflow = async (s3TaskDataPath: string) => {
  const workflows = await waitForWorkflows({
    freeText: s3TaskDataPath,
    query: {
      workflowType: "bichard_process",
      status: "COMPLETED"
    }
  })
  expect(workflows).toHaveLength(1)
}

const getAuditLogs = async (correlationId: string) => {
  const auditLog = await auditLogClient.getMessage(correlationId)
  if (isError(auditLog)) {
    throw new Error("Error retrieving audit log")
  }
  return auditLog.events.map((e) => e.eventCode)
}

const mockPncRequest = async (fixture: string) => {
  const mock = JSON.parse(String(fs.readFileSync(fixture)))
  await axios.post("http://localhost:3000/mocks", mock)
}

const clearMockPncRequests = () => axios.delete("http://localhost:3000/mocks")

describe("bichard_process workflow", () => {
  let mqListener: MqListener
  let correlationId: string
  let s3TaskDataPath: string

  beforeAll(async () => {
    mqListener = new MqListener(mqConfig)
    await mqListener.listen("TEST_PHASE2_QUEUE")
  })

  afterAll(() => {
    db.end()
    mqListener.stop()
  })

  beforeEach(async () => {
    correlationId = randomUUID()
    s3TaskDataPath = `${randomUUID()}.json`

    await clearMockPncRequests()
    mqListener.clearMessages()

    await createAuditLog(correlationId)
  })

  it("should store audit logs and send to phase 2 if there are no triggers or exceptions", async () => {
    await putMessageInS3("e2e-test/fixtures/success-no-triggers-aho.json", s3TaskDataPath, correlationId)
    await mockPncRequest("e2e-test/fixtures/success-no-triggers-aho.pnc.json")
    await startWorkflow("bichard_process", { s3TaskDataPath }, correlationId, conductorConfig)
    await waitForWorkflow(s3TaskDataPath)

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
    await putMessageInS3("e2e-test/fixtures/only-triggers-aho.json", s3TaskDataPath, correlationId)
    await mockPncRequest("e2e-test/fixtures/only-triggers-aho.pnc.json")
    await startWorkflow("bichard_process", { s3TaskDataPath }, correlationId, conductorConfig)
    await waitForWorkflow(s3TaskDataPath)

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
    await putMessageInS3("e2e-test/fixtures/ignored-aho.json", s3TaskDataPath, correlationId)
    await startWorkflow("bichard_process", { s3TaskDataPath }, correlationId, conductorConfig)
    await waitForWorkflow(s3TaskDataPath)

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

  it.todo("should wait for and process a resubmission if there are exceptions")

  it.todo("should store audit logs if the record is manually resolved")
})
