import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import type EventCategory from "@moj-bichard7/common/types/EventCategory"
import type EventCode from "@moj-bichard7/common/types/EventCode"

export default interface AuditLogger {
  /**
   * Adds an audit log event to the audit log event list
   */
  log(code: EventCode, category: EventCategory, attributes: Record<string, unknown>): void

  /**
   * Adds a debug log.
   */
  debug(code: EventCode, attributes?: Record<string, unknown>): void

  /**
   * Adds an info log.
   */
  info(code: EventCode, attributes?: Record<string, unknown>): void

  /**
   * Adds an error log.
   */
  error(code: EventCode, attributes?: Record<string, unknown>): void

  /**
   * Adds a warn log.
   */
  warn(code: EventCode, attributes?: Record<string, unknown>): void

  /**
   * Gets all the events.
   * @returns Audit log events logged by this instance
   */
  getEvents(): AuditLogEvent[]
}
