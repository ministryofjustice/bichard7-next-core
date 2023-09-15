import "../../phase1/tests/helpers/setEnvironmentVariables"

import AuditLogApiClient from "@moj-bichard7/common/AuditLogApiClient/AuditLogApiClient"

import createApiConfig from "@moj-bichard7/common/AuditLogApiClient/createApiConfig"
import { type AuditLogApiRecordInput } from "@moj-bichard7/common/types/AuditLogRecord"
import { v4 as uuid } from "uuid"
import createAuditLogRecord from "./createAuditLogRecord"

const { apiKey, apiUrl } = createApiConfig()
const apiClient = new AuditLogApiClient(apiUrl, apiKey, 30_000)

describe("createAuditLogRecord", () => {
  let auditLogRecord: AuditLogApiRecordInput

  beforeEach(() => {
    const externalId = uuid()
    const messageId = uuid()
    const s3Path = `2023/08/31/14/48/${externalId}.xml`

    auditLogRecord = {
      caseId: "01ZD0303208",
      createdBy: "Incoming message handler",
      externalCorrelationId: "CID-test-001",
      externalId,
      isSanitised: 0,
      messageHash: uuid(),
      messageId,
      receivedDate: "2023-08-31T13:48:00.000Z",
      s3Path,
      systemId: "B00LIBRA"
    }
  })
  it("should correctly insert an audit log record", async () => {
    const result = await createAuditLogRecord.execute({ inputData: { auditLogRecord } })
    expect(result.status).toBe("COMPLETED")

    const auditLog = await apiClient.getMessage(auditLogRecord.messageId)
    expect(auditLog).toHaveProperty("externalCorrelationId", auditLogRecord.externalCorrelationId)
    expect(auditLog).toHaveProperty("messageId", auditLogRecord.messageId)
  })

  it("should fail with terminal error if the auditLogRecord hasn't been provided", async () => {
    const result = await createAuditLogRecord.execute({ inputData: {} })

    expect(result.status).toBe("FAILED_WITH_TERMINAL_ERROR")
  })

  it.todo("should fail with terminal error if the audit log record is invalid")

  it("should correctly identify a duplicate message hash", async () => {
    const oldMessageId = auditLogRecord.messageId

    await apiClient.createAuditLog(auditLogRecord)
    auditLogRecord.messageId = uuid()

    const result = await createAuditLogRecord.execute({ inputData: { auditLogRecord } })
    expect(result.status).toBe("COMPLETED")
    expect(result.outputData).toHaveProperty("duplicateCorrelationId", oldMessageId)
    expect(result.outputData).toHaveProperty("duplicateMessage", "isDuplicate")
  })

  it("should fail task if audit log can't be stored", async () => {
    await apiClient.createAuditLog(auditLogRecord)
    auditLogRecord.messageHash = uuid()

    const result = await createAuditLogRecord.execute({ inputData: { auditLogRecord } })
    expect(result.status).toBe("FAILED")
  })
})
