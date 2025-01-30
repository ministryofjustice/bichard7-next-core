import type { DynamoAuditLog } from "../../types/AuditLog"
import type { DynamoAuditLogEvent } from "../../types/AuditLogEvent"

import EventCode from "../../types/EventCode"

export default (events: DynamoAuditLogEvent[]): Partial<DynamoAuditLog> => {
  const sanitisationEvents = events.filter((event) => event.eventCode === EventCode.Sanitised)
  if (sanitisationEvents.length > 0) {
    return { isSanitised: 1, nextSanitiseCheck: undefined }
  }

  return {}
}
