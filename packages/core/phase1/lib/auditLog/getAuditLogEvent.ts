import type { AuditLogEvent, AuditLogEventOption } from "@moj-bichard7/common/types/AuditLogEvent"
import type EventCategory from "@moj-bichard7/common/types/EventCategory"
import type EventCode from "@moj-bichard7/common/types/EventCode"

const getAuditLogEvent = (
  option: AuditLogEventOption,
  category: EventCategory,
  eventSource: string,
  attributes: Record<string, unknown>
): AuditLogEvent => {
  return {
    eventCode: option.code as EventCode,
    attributes,
    timestamp: new Date().toISOString(),
    eventType: option.type,
    eventSource,
    category
  }
}

export default getAuditLogEvent
