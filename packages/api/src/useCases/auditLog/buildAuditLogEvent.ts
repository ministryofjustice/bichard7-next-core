import type EventCategory from "@moj-bichard7/common/types/EventCategory"
import type EventCode from "@moj-bichard7/common/types/EventCode"

import type { ApiAuditLogEvent } from "../../types/AuditLogEvent"

import { AuditLogEventLookup } from "./auditLogEventLookup"

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
