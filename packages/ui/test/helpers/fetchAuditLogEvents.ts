import axios from "axios"
import { AUDIT_LOG_API_URL } from "../../src/config"

const fetchAuditLogEvents = async (messageId: string) => {
  const apiResult = await axios(`${AUDIT_LOG_API_URL}/messages/${messageId}`)
  const auditLogs = (await apiResult.data) as [{ events: [{ timestamp: string; eventCode: string }] }]
  return auditLogs[0].events
}

export default fetchAuditLogEvents
