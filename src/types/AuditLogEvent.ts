import type EventCategory from "./EventCategory"

export default interface AuditLogEvent {
  timestamp: Date
  eventType: string
  eventXml?: string
  eventSourceArn?: string
  eventSourceQueueName?: string
  eventSource: string
  category: EventCategory
}
