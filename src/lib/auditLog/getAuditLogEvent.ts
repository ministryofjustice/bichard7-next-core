import type AuditLogEvent from "src/types/AuditLogEvent"
import type { AuditLogEventOption, AuditLogEventSource } from "src/types/AuditLogEvent"
import type EventCategory from "src/types/EventCategory"
import type KeyValuePair from "src/types/KeyValuePair"

const getAuditLogEvent = (
  AuditLogEventOptions: AuditLogEventOption,
  category: EventCategory,
  eventSource: AuditLogEventSource,
  attributes: KeyValuePair<string, unknown>
): AuditLogEvent => {
  return {
    eventCode: AuditLogEventOptions.code,
    attributes,
    timestamp: new Date().toISOString(),
    eventType: AuditLogEventOptions.type,
    eventSource,
    category
  }
}

export default getAuditLogEvent
