import "../../phase1/tests/helpers/setEnvironmentVariables"

import AuditLogApiClient from "@moj-bichard7/common/AuditLogApiClient/AuditLogApiClient"

import createApiConfig from "@moj-bichard7/common/AuditLogApiClient/createApiConfig"
import { type InputApiAuditLog } from "@moj-bichard7/common/types/AuditLogRecord"
import { v4 as uuid } from "uuid"
import createAuditLogRecord from "./createAuditLogRecord"

const { apiKey, apiUrl } = createApiConfig()
const apiClient = new AuditLogApiClient(apiUrl, apiKey, 30_000)

describe("createAuditLogRecord", () => {
  let auditLogRecord: InputApiAuditLog

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

  it("should fail if the auditLogRecord hasn't been provided", async () => {
    const result = await createAuditLogRecord.execute({ inputData: {} })

    expect(result.status).toBe("FAILED_WITH_TERMINAL_ERROR")
  })

  it("should fail if there is a duplicate message hash", async () => {
    await apiClient.createAuditLog(auditLogRecord)
    auditLogRecord.messageId = uuid()

    const result = await createAuditLogRecord.execute({ inputData: { auditLogRecord } })
    expect(result.status).toBe("FAILED")
  })
})
