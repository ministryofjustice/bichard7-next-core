import "./helpers/setEnvironmentVariables"

import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import AuditLogApiClient from "@moj-bichard7/common/AuditLogApiClient/AuditLogApiClient"
import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import getFileFromS3 from "@moj-bichard7/common/s3/getFileFromS3"
import { createAuditLogRecord } from "@moj-bichard7/common/test/audit-log-api/createAuditLogRecord"
import { waitForCompletedWorkflow } from "@moj-bichard7/common/test/conductor/waitForCompletedWorkflow"
import waitForWorkflows from "@moj-bichard7/common/test/conductor/waitForWorkflows"
import { clearPncMocks } from "@moj-bichard7/common/test/pnc/clearPncMocks"
import { uploadPncMock } from "@moj-bichard7/common/test/pnc/uploadPncMock"
import { putIncomingMessageToS3 } from "@moj-bichard7/common/test/s3/putIncomingMessageToS3"
import { isError } from "@moj-bichard7/common/types/Result"
import insertErrorListRecord from "@moj-bichard7/core/lib/database/insertErrorListRecord"
import errorPaths from "@moj-bichard7/core/lib/exceptions/errorPaths"
import generateMockPhase2Result from "@moj-bichard7/core/phase2/tests/helpers/generateMockPhase2Result"
import { randomUUID } from "crypto"
import postgres from "postgres"

import successNoTriggersPncMock from "./fixtures/phase3/success-no-triggers-aho.pnc.json"
import { startWorkflow } from "./helpers/e2eHelpers"
import getAuditLogs from "./helpers/getAuditLogs"
import getFixture from "./helpers/getFixture"

const TASK_DATA_BUCKET_NAME = "conductor-task-data"
const s3Config = createS3Config()
const auditLogClient = new AuditLogApiClient("http://localhost:7010", "test")
const dbConfig = createDbConfig()
const db = postgres(dbConfig)

describe("bichard_phase_3 workflow", () => {
  let correlationId: string
  let s3TaskDataPath: string

  afterAll(() => {
    db.end()
  })

  beforeEach(async () => {
    correlationId = randomUUID()
    s3TaskDataPath = `${randomUUID()}.json`

    await clearPncMocks()

    await createAuditLogRecord(correlationId)
  })

  it("processes and stores audit log events for a message with no triggers and exceptions that hasn't previously had exceptions", async () => {
    const fixture = getFixture("e2e-test/fixtures/phase3/success-aho.json", correlationId)
    await putIncomingMessageToS3(fixture, s3TaskDataPath, correlationId)
    await uploadPncMock(successNoTriggersPncMock)
    await startWorkflow("bichard_phase_3", { s3TaskDataPath }, correlationId)
    await waitForCompletedWorkflow(s3TaskDataPath, "COMPLETED", 60000, "bichard_phase_3")

    const dbResult = await db`SELECT count(*) from br7own.error_list WHERE message_id = ${correlationId}`
    expect(dbResult[0]).toHaveProperty("count", "0")

    // Check the correct audit logs are in place
    const auditLogEventCodes = await getAuditLogs(correlationId, auditLogClient)
    expect(auditLogEventCodes).toContain("hearing-outcome.received-phase-3")

    // Check the temp file has been cleaned up
    const s3File = await getFileFromS3(s3TaskDataPath, TASK_DATA_BUCKET_NAME, s3Config, 1)
    expect(isError(s3File)).toBeTruthy()
    expect((s3File as Error).message).toBe("The specified key does not exist.")
  })

  it("processes and stores audit log events for a message with no triggers and exceptions and resolves previous exceptions if there are any", async () => {
    const result = generateMockPhase2Result({ correlationId })
    result.outputMessage.Exceptions.push({ code: ExceptionCode.HO100100, path: errorPaths.case.asn })
    await insertErrorListRecord(db, result)
    const fixture = getFixture("e2e-test/fixtures/phase3/success-aho.json", correlationId)
    await putIncomingMessageToS3(fixture, s3TaskDataPath, correlationId)
    await uploadPncMock(successNoTriggersPncMock)
    await startWorkflow("bichard_phase_3", { s3TaskDataPath }, correlationId)
    await waitForCompletedWorkflow(s3TaskDataPath, "COMPLETED", 60000, "bichard_phase_3")

    const dbResult =
      await db`SELECT count(*) from br7own.error_list WHERE message_id = ${correlationId} AND error_status = 2`
    expect(dbResult[0]).toHaveProperty("count", "1")

    // Check the correct audit logs are in place
    const auditLogEventCodes = await getAuditLogs(correlationId, auditLogClient)
    expect(auditLogEventCodes).toContain("hearing-outcome.received-phase-3")

    // Check the temp file has been cleaned up
    const s3File = await getFileFromS3(s3TaskDataPath, TASK_DATA_BUCKET_NAME, s3Config, 1)
    expect(isError(s3File)).toBeTruthy()
    expect((s3File as Error).message).toBe("The specified key does not exist.")
  })

  it("should terminate the workflow gracefully if the S3 file has already been processed", async () => {
    const fixture = getFixture("e2e-test/fixtures/phase3/success-aho.json", correlationId)
    await putIncomingMessageToS3(fixture, s3TaskDataPath, correlationId)
    await uploadPncMock(successNoTriggersPncMock)
    await startWorkflow("bichard_phase_3", { s3TaskDataPath }, correlationId)
    await waitForCompletedWorkflow(s3TaskDataPath, "COMPLETED", 60000, "bichard_phase_3")
    const secondWorkflowId = await startWorkflow("bichard_phase_3", { s3TaskDataPath }, correlationId)
    const workflows = await waitForWorkflows({
      count: 2,
      query: { correlationId, status: "COMPLETED", workflowType: "bichard_phase_3" }
    })
    const secondWorkflow = workflows.find((wf) => wf.workflowId === secondWorkflowId)
    expect(secondWorkflow?.reasonForIncompletion).toMatch(/Workflow is COMPLETED by TERMINATE task/)
  })
})
