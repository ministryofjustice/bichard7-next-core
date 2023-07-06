import type { AuditLogEvent } from "src/types/AuditLogEvent"
import type AuditLogger from "src/types/AuditLogger"

export default class CoreAuditLogger implements AuditLogger {
  private events: AuditLogEvent[] = []

  logEvent = (auditLogEvent: AuditLogEvent): AuditLogger => {
    this.events.push(auditLogEvent)

    return this
  }

  getEvents = (): AuditLogEvent[] => this.events
}
