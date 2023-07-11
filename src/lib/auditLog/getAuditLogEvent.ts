import type { AuditLogEvent } from "src/types/AuditLogEvent"
import type { AuditLogEventOption } from "src/types/AuditLogEvent"
import type EventCategory from "src/types/EventCategory"
import type KeyValuePair from "src/types/KeyValuePair"

const getAuditLogEvent = (
  option: AuditLogEventOption,
  category: EventCategory,
  eventSource: string,
  attributes: KeyValuePair<string, unknown>
): AuditLogEvent => {
  return {
    eventCode: option.code,
    attributes,
    timestamp: new Date().toISOString(),
    eventType: option.type,
    eventSource,
    category
  }
}

export default getAuditLogEvent
