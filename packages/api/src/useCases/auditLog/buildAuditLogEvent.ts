import type EventCategory from "@moj-bichard7/common/types/EventCategory"
import type EventCode from "@moj-bichard7/common/types/EventCode"

import { auditLogEventLookup as AuditLogEventLookup } from "@moj-bichard7/common/types/AuditLogEvent"

import type { ApiAuditLogEvent } from "../../types/AuditLogEvent"

const buildAuditLogEvent = (
  eventCode: EventCode,
  category: EventCategory,
  eventSource: string,
  attributes: Record<string, boolean | number | string> = {}
): ApiAuditLogEvent => {
  return {
    attributes,
    category,
    eventCode,
    eventSource,
    eventType: AuditLogEventLookup[eventCode],
    timestamp: new Date().toISOString()
  }
}

export default buildAuditLogEvent
