import type AuditLogApiClient from "@moj-bichard7/common/AuditLogApiClient/AuditLogApiClient"

import { isError } from "@moj-bichard7/common/types/Result"

const getAuditLogs = async (correlationId: string, auditLogClient: AuditLogApiClient) => {
  const auditLog = await auditLogClient.getMessage(correlationId)
  if (isError(auditLog)) {
    throw new Error("Error retrieving audit log")
  }

  return auditLog.events.map((e) => e.eventCode)
}

export default getAuditLogs
