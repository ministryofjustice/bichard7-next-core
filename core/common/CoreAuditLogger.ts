import type { AuditLogEvent } from "common/types/AuditLogEvent"
import type AuditLogger from "core/phase1/types/AuditLogger"

export default class CoreAuditLogger implements AuditLogger {
  private events: AuditLogEvent[] = []

  logEvent = (auditLogEvent: AuditLogEvent): AuditLogger => {
    this.events.push(auditLogEvent)

    return this
  }

  getEvents = (): AuditLogEvent[] => this.events
}
