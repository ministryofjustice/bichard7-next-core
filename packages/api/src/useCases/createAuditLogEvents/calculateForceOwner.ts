import { maxBy } from "lodash"

import type { DynamoAuditLog } from "../../types/AuditLog"
import type { DynamoAuditLogEvent } from "../../types/AuditLogEvent"

import getForceOwner from "./getForceOwner"

export default (events: DynamoAuditLogEvent[]): Partial<DynamoAuditLog> => {
  const forceOwnerEvents = events.filter((event) => getForceOwner(event) !== undefined)
  const forceOwnerEvent = maxBy(forceOwnerEvents, (event) => event.timestamp)

  if (forceOwnerEvent) {
    return { forceOwner: getForceOwner(forceOwnerEvent) }
  }

  return {}
}
