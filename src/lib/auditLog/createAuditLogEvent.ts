import type AuditLogEvent from "src/types/AuditLogEvent"
import type EventCategory from "src/types/EventCategory"
import type KeyValuePair from "src/types/KeyValuePair"

const createAuditLogEvent = (
  eventCode: string,
  category: EventCategory,
  eventType: string,
  eventSource: string,
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

export default createAuditLogEvent
