import type AuditLogEvent from "src/types/AuditLogEvent"
import type AuditLogger from "src/types/AuditLogger"

export default class CoreAuditLogger implements AuditLogger {
  private events: AuditLogEvent[] = []

  private scope: string | null = null

  start = (scope: string): AuditLogger => {
    if (this.scope) {
      throw Error("Logger is already started")
    }

    this.scope = scope
    this.events = []
    return this
  }

  finish = (): AuditLogger => {
    if (!this.scope) {
      throw Error("Logger is not started")
    }

    this.scope = null
    return this
  }

  logEvent = (auditLogEvent: AuditLogEvent): AuditLogger => {
    if (!this.scope) {
      throw Error("Logger is not started")
    }

    this.events.push(auditLogEvent)

    return this
  }

  getEvents = (): AuditLogEvent[] => {
    if (this.scope) {
      throw Error("Logger is not finished yet")
    }

    return this.events
  }
}
