import EventCode from "@moj-bichard7/common/types/EventCode"
import { minBy } from "lodash"

import type { DynamoAuditLog } from "../../types/AuditLog"
import type { DynamoAuditLogEvent } from "../../types/AuditLogEvent"

export default (events: DynamoAuditLogEvent[]): Partial<DynamoAuditLog> => {
  const archivalEvents = events.filter((event) => event.eventCode === EventCode.ErrorRecordArchived)
  if (archivalEvents.length > 0) {
    return {
      errorRecordArchivalDate: minBy(archivalEvents, (event) => event.timestamp)?.timestamp
    }
  }

  return {}
}
