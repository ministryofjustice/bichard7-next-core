import type EventCategory from "./EventCategory"
import type KeyValuePair from "./KeyValuePair"

type AuditLogEvent = {
  attributes?: KeyValuePair<string, unknown>
  category: EventCategory
  eventCode: string
  eventSource: string
  eventSourceQueueName?: string
  eventType: string
  timestamp: string
  user?: string
}

export default AuditLogEvent
