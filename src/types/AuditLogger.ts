import type AuditLogEvent from "./AuditLogEvent"

export default interface AuditLogger {
  start(scope: string): AuditLogger
  finish(): AuditLogger
  logEvent(eventType: string): AuditLogger
  getEvents(): AuditLogEvent[]
}
