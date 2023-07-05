import type AuditLogEvent from "src/types/AuditLogEvent"
import type { AuditLogEventSource } from "src/types/AuditLogEvent"
import type EventCategory from "src/types/EventCategory"
import type KeyValuePair from "src/types/KeyValuePair"

const getAuditLogEvent = (
  eventCode: string,
  category: EventCategory,
  eventType: string,
  eventSource: AuditLogEventSource,
  attributes: KeyValuePair<string, unknown>
): AuditLogEvent => {
  return {
    eventCode,
    attributes,
    timestamp: new Date().toISOString(),
    eventType,
    eventSource,
    category
  }
}

export default getAuditLogEvent
