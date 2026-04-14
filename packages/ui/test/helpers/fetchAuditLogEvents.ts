import { AUDIT_LOG_API_URL } from "../../src/config"

const fetchAuditLogEvents = async (messageId: string) => {
  const apiResult = await fetch(`${AUDIT_LOG_API_URL}/messages/${messageId}`)

  if (!apiResult.ok) {
    throw new Error(`Failed to fetch audit log events: ${apiResult.status} ${apiResult.statusText}`)
  }

  const auditLogs = (await apiResult.json()) as [{ events: [{ timestamp: string; eventCode: string }] }]
  return auditLogs[0].events
}

export default fetchAuditLogEvents
