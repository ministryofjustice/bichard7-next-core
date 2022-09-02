import type AuditLogEvent from "./AuditLogEvent"

export default interface AuditLogger {
  /**
   * Starts the audit logger and adds the first event for when the logger started.
   * @param scope Name of the logger. The value will appear in event type of start and end events.
   * @returns The audit logger instance
   */
  start(scope: string): AuditLogger

  /**
   * Finishes the audit logger and adds the final event for when the logger finished.
   * Audit logger must be started by calling start() function before being able to finish it.
   * @returns The audit logger instance
   */
  finish(): AuditLogger

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
