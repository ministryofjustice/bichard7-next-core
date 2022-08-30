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
    this.logEvent({
      timestamp: new Date(),
      eventType: `Started ${this.scope}`,
      eventSourceArn: "",
      eventSourceQueueName: "",
      eventSource: "Core Audit Logger",
      category: "information"
    })

    return this
  }

  finish = (): AuditLogger => {
    if (!this.scope) {
      throw Error("Logger is not started")
    }

    this.logEvent({
      timestamp: new Date(),
      eventType: `Finished ${this.scope}`,
      eventSourceArn: "",
      eventSourceQueueName: "",
      eventSource: "Core Audit Logger",
      category: "information"
    })

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
