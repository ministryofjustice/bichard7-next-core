import type { AuditLogEvent, AuditLogEventOption } from "core/phase1/types/AuditLogEvent"
import type EventCategory from "core/phase1/types/EventCategory"

const getAuditLogEvent = (
  option: AuditLogEventOption,
  category: EventCategory,
  eventSource: string,
  attributes: Record<string, unknown>
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
