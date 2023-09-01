import "../../phase1/tests/helpers/setEnvironmentVariables"

import AuditLogApiClient from "@moj-bichard7/common/AuditLogApiClient/AuditLogApiClient"

import createApiConfig from "@moj-bichard7/common/AuditLogApiClient/createApiConfig"
import { v4 as uuid } from "uuid"
import createAuditLogRecord from "./createAuditLogRecord"

const { apiKey, apiUrl } = createApiConfig()
const apiClient = new AuditLogApiClient(apiUrl, apiKey, 30_000)

describe("createAuditLogRecord", () => {
  it("should correctly insert an audit log record", async () => {
    const externalId = uuid()
    const messageId = uuid()
    const s3Path = `2023/08/31/14/48/${externalId}.xml`

    const auditLogRecord = {
      caseId: "01ZD0303208",
      createdBy: "Incoming message handler",
      externalCorrelationId: "CID-test-001",
      externalId,
      isSanitised: 0,
      messageHash: uuid(),
      messageId,
      receivedDate: new Date("2023-08-31T13:48:00.000Z"),
      s3Path,
      systemId: "B00LIBRA"
    }

    const result = await createAuditLogRecord.execute({ inputData: { auditLogRecord } })
    expect(result.status).toBe("COMPLETED")

    const auditLog = await apiClient.getMessage(messageId)
    expect(auditLog).toHaveProperty("externalCorrelationId", auditLogRecord.externalCorrelationId)
    expect(auditLog).toHaveProperty("messageId", auditLogRecord.messageId)
  })
})
