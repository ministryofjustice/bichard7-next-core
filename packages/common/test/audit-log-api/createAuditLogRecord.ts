import { randomUUID } from "crypto"

import { AuditLogApiClient } from "../../AuditLogApiClient"
import createApiConfig from "../../AuditLogApiClient/createApiConfig"

process.env.AUDIT_LOG_API_URL = "https://localhost:3333"
process.env.AUDIT_LOG_USE_JWT = "true"
process.env.AUDIT_LOG_API_BASE_PATH = "v1/audit-logs"
process.env.AUTH_JWT_SECRET = "ExtraExtraLongSuperSecretTokenSecret"

const { apiKey, apiUrl, basePath } = createApiConfig()
const auditLogClient = new AuditLogApiClient(apiUrl, apiKey, 30_000, basePath)

export const createAuditLogRecord = (correlationId: string) =>
  auditLogClient.createAuditLog({
    caseId: "dummy",
    createdBy: "test",
    externalCorrelationId: randomUUID(),
    isSanitised: 0,
    messageHash: randomUUID(),
    messageId: correlationId,
    receivedDate: new Date().toISOString()
  })
