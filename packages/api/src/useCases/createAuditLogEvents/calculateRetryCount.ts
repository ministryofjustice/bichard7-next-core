import EventCode from "@moj-bichard7/common/types/EventCode"

import type { DynamoAuditLog } from "../../types/AuditLog"
import type { DynamoAuditLogEvent } from "../../types/AuditLogEvent"

export default (events: DynamoAuditLogEvent[]): Partial<DynamoAuditLog> => {
  const retryEvents = events.filter((event) => event.eventCode === EventCode.RetryingMessage)
  if (retryEvents.length > 0) {
    return { retryCount: retryEvents.length }
  }

  return {}
}
