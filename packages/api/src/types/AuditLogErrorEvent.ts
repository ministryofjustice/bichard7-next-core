import type EventCategory from "@moj-bichard7/common/types/EventCategory"

import type { ApiAuditLogEvent } from "./AuditLogEvent"

interface AuditLogErrorEvent extends ApiAuditLogEvent {
  category: EventCategory.error
  eventSourceQueueName: string
  eventXml: string
}

export default AuditLogErrorEvent
