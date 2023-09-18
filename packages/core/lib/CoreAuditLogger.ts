import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import getAuditLogEvent from "../phase1/lib/auditLog/getAuditLogEvent"
import type AuditLogger from "../phase1/types/AuditLogger"

export default class CoreAuditLogger implements AuditLogger {
  private events: AuditLogEvent[] = []

  logEvent = (auditLogEvent: AuditLogEvent): AuditLogger => {
    this.events.push(auditLogEvent)

    return this
  }

  debug = (code: EventCode): AuditLogger => {
    const event = getAuditLogEvent(eventCode)
    return this
  }

  getEvents = (): AuditLogEvent[] => this.events
}
