import { auditLogEventLookup, type AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import type EventCategory from "@moj-bichard7/common/types/EventCategory"
import type EventCode from "@moj-bichard7/common/types/EventCode"

const getAuditLogEvent = (
  eventCode: EventCode,
  category: EventCategory,
  eventSource: string,
  attributes: Record<string, unknown> = {}
): AuditLogEvent => {
  return {
    eventCode,
    attributes,
    timestamp: new Date(),
    eventType: auditLogEventLookup[eventCode],
    eventSource,
    category
  }
}

export default getAuditLogEvent
