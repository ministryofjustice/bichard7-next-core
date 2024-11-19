import { randomUUID } from "crypto"
import { AuditLogApiClient } from "../../AuditLogApiClient"

const auditLogClient = new AuditLogApiClient("http://localhost:7010", "test")

export const createAuditLogRecord = (correlationId: string) =>
  auditLogClient.createAuditLog({
    caseId: "dummy",
    messageId: correlationId,
    receivedDate: new Date().toISOString(),
    messageHash: randomUUID(),
    createdBy: "test",
    externalCorrelationId: randomUUID(),
    isSanitised: 0
  })
