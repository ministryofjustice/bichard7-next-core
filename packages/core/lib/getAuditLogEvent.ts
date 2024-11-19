import type EventCategory from "@moj-bichard7/common/types/EventCategory"
import type EventCode from "@moj-bichard7/common/types/EventCode"

import { type AuditLogEvent, auditLogEventLookup } from "@moj-bichard7/common/types/AuditLogEvent"

const getAuditLogEvent = (
  eventCode: EventCode,
  category: EventCategory,
  eventSource: string,
  attributes: Record<string, unknown> = {}
): AuditLogEvent => {
  return {
    attributes,
    category,
    eventCode,
    eventSource,
    eventType: auditLogEventLookup[eventCode],
    timestamp: new Date()
  }
}

export default getAuditLogEvent
