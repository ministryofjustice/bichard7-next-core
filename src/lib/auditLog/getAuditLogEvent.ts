import type AuditLogEvent from "src/types/AuditLogEvent"
import type EventCategory from "src/types/EventCategory"
import type KeyValuePair from "src/types/KeyValuePair"

const getAuditLogEvent = (
  category: EventCategory,
  eventType: string,
  eventSource: string,
  attributes: KeyValuePair<string, unknown>
): AuditLogEvent => {
  return {
    attributes: attributes,
    timestamp: new Date(),
    eventType: eventType,
    eventSource: eventSource,
    category: category
  }
}

export default getAuditLogEvent
