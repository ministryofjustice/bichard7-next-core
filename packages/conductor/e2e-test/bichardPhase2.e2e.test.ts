import "./helpers/setEnvironmentVariables"

import AuditLogApiClient from "@moj-bichard7/common/AuditLogApiClient/AuditLogApiClient"
import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import createMqConfig from "@moj-bichard7/common/mq/createMqConfig"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import getFileFromS3 from "@moj-bichard7/common/s3/getFileFromS3"
import { createAuditLogRecord } from "@moj-bichard7/common/test/audit-log-api/createAuditLogRecord"
import { waitForCompletedWorkflow } from "@moj-bichard7/common/test/conductor/waitForCompletedWorkflow"
import waitForWorkflows from "@moj-bichard7/common/test/conductor/waitForWorkflows"
import MqListener from "@moj-bichard7/common/test/mq/listener"
import { putIncomingMessageToS3 } from "@moj-bichard7/common/test/s3/putIncomingMessageToS3"
import { isError } from "@moj-bichard7/common/types/Result"
import { randomUUID } from "crypto"
import fs from "fs"
import postgres from "postgres"

import { startWorkflow } from "./helpers/e2eHelpers"

const TASK_DATA_BUCKET_NAME = "conductor-task-data"
const s3Config = createS3Config()
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

const getFixture = (path: string, correlationId: string): string =>
  String(fs.readFileSync(path)).replace("CORRELATION_ID", correlationId)

describe("bichard_phase_2 workflow", () => {
  let mqListener: MqListener
  let correlationId: string
  let s3TaskDataPath: string

  beforeAll(() => {
    mqListener = new MqListener(mqConfig)
    mqListener.listen("TEST_PHASE3_QUEUE")
  })

  afterAll(() => {
    db.end()
    mqListener.stop()
  })

  beforeEach(async () => {
    correlationId = randomUUID()
    s3TaskDataPath = `${randomUUID()}.json`

    mqListener.clearMessages()

    await createAuditLogRecord(correlationId)
  })

  it("should store audit logs and send to phase 3 if there are no triggers or exceptions", async () => {
    const fixture = getFixture("e2e-test/fixtures/phase2/success-aho.json", correlationId)
    await putIncomingMessageToS3(fixture, s3TaskDataPath, correlationId)
    await startWorkflow("bichard_phase_2", { s3TaskDataPath }, correlationId)
    await waitForCompletedWorkflow(s3TaskDataPath, "COMPLETED", 60000, "bichard_phase_2")

    // Make sure it hasn't been persisted
    const dbResult = await db`SELECT count(*) from br7own.error_list WHERE message_id = ${correlationId}`
    expect(dbResult[0]).toHaveProperty("count", "0")

    // Check the correct audit logs are in place
    const auditLogEventCodes = await getAuditLogs(correlationId)
    expect(auditLogEventCodes).toContain("hearing-outcome.received-phase-2")
    expect(auditLogEventCodes).toContain("hearing-outcome.submitted-phase-3")

    // Check the message was sent to the message queue
    expect(mqListener.messages).toHaveLength(1)
    expect(mqListener.messages[0]).toMatch(correlationId)

    // Check the temp file has been cleaned up
    const s3File = await getFileFromS3(s3TaskDataPath, TASK_DATA_BUCKET_NAME, s3Config, 1)
    expect(isError(s3File)).toBeTruthy()
    expect((s3File as Error).message).toBe("The specified key does not exist.")
  })

  it("should store triggers if the message is ignored but still has triggers", async () => {
    const fixture = getFixture("e2e-test/fixtures/phase2/only-triggers-aho.json", correlationId)
    await putIncomingMessageToS3(fixture, s3TaskDataPath, correlationId)
    await startWorkflow("bichard_phase_2", { s3TaskDataPath }, correlationId)
    await waitForCompletedWorkflow(s3TaskDataPath, "COMPLETED", 60000, "bichard_phase_2")

    // Make sure it has been persisted
    const dbResult = await db`SELECT count(*) from br7own.error_list
                                    WHERE message_id = ${correlationId}
                                    AND trigger_count = 2 AND error_count = 0`
    expect(dbResult[0]).toHaveProperty("count", "1")

    // Check the correct audit logs are in place
    const auditLogEventCodes = await getAuditLogs(correlationId)
    expect(auditLogEventCodes).toContain("hearing-outcome.ignored.nonrecordable")
    expect(auditLogEventCodes).toContain("triggers.generated")

    // Check the temp file has been cleaned up
    const s3File = await getFileFromS3(s3TaskDataPath, TASK_DATA_BUCKET_NAME!, s3Config, 1)
    expect(isError(s3File)).toBeTruthy()
    expect((s3File as Error).message).toBe("The specified key does not exist.")
  })

  it("should persist the record and stop if there are exceptions", async () => {
    const fixture = getFixture("e2e-test/fixtures/phase2/ignored-aho.json", correlationId)
    await putIncomingMessageToS3(fixture, s3TaskDataPath, correlationId)
    await startWorkflow("bichard_phase_2", { s3TaskDataPath }, correlationId)
    await waitForCompletedWorkflow(s3TaskDataPath, "COMPLETED", 60000, "bichard_phase_2")

    // Make sure it has been persisted
    const dbResult = await db`SELECT count(*) from br7own.error_list
                                    WHERE message_id = ${correlationId}
                                    AND error_count = 1`
    expect(dbResult[0]).toHaveProperty("count", "1")

    // Check the correct audit logs are in place
    const auditLogEventCodes = await getAuditLogs(correlationId)
    expect(auditLogEventCodes).toContain("hearing-outcome.received-phase-2")

    // Check the message was not sent to the message queue
    expect(mqListener.messages).toHaveLength(0)

    // Check the temp file has been cleaned up
    const s3File = await getFileFromS3(s3TaskDataPath, TASK_DATA_BUCKET_NAME!, s3Config, 1)
    expect(isError(s3File)).toBeTruthy()
    expect((s3File as Error).message).toBe("The specified key does not exist.")
  })

  it("should terminate the workflow gracefully if the S3 file has already been processed", async () => {
    const fixture = getFixture("e2e-test/fixtures/phase2/success-aho.json", correlationId)
    await putIncomingMessageToS3(fixture, s3TaskDataPath, correlationId)
    await startWorkflow("bichard_phase_2", { s3TaskDataPath }, correlationId)
    await waitForCompletedWorkflow(s3TaskDataPath, "COMPLETED", 60000, "bichard_phase_2")
    const secondWorkflowId = await startWorkflow("bichard_phase_2", { s3TaskDataPath }, correlationId)
    const workflows = await waitForWorkflows({
      count: 2,
      query: { correlationId, status: "COMPLETED", workflowType: "bichard_phase_2" }
    })
    const secondWorkflow = workflows.find((wf) => wf.workflowId === secondWorkflowId)
    expect(secondWorkflow?.reasonForIncompletion).toMatch(/Workflow is COMPLETED by TERMINATE task/)
  })
})
