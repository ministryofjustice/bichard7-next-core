import type EventCategory from "./EventCategory"
import type KeyValuePair from "./KeyValuePair"

export default interface AuditLogEvent {
  timestamp: Date
  eventType: string
  eventXml?: string
  eventSourceArn?: string
  eventSourceQueueName?: string
  eventSource: string
  category: EventCategory
  attributes?: KeyValuePair<string, unknown>
}
