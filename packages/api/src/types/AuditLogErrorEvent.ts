import type { ApiAuditLogEvent } from "./AuditLogEvent"

interface AuditLogErrorEvent extends ApiAuditLogEvent {
  category: "error"
  eventSourceQueueName: string
  eventXml: string
}

export default AuditLogErrorEvent
