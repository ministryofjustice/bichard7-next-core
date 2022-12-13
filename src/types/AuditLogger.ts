import type AuditLogEvent from "./AuditLogEvent"

export default interface AuditLogger {
  /**
   * Adds a new log.
   * Audit logger must be started by calling start() function before being able to add a log.
   * @returns The audit logger instance
   */
  logEvent(auditLogEvent: AuditLogEvent): AuditLogger

  /**
   * Gets all the events.
   * Audit logger must be finished by calling finish() function before being able to get events.
   * @returns Audit log events logged by this instance
   */
  getEvents(): AuditLogEvent[]
}
