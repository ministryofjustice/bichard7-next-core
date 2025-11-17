import type AuditLogEvent from "./AuditLogEvent"
import type KeyValuePair from "./KeyValuePair"
import type PromiseResult from "./PromiseResult"
import type { Result } from "./Result"

type EventLogger = (event: AuditLogEvent, attributes?: KeyValuePair<string, unknown>) => PromiseResult<void>

type ErrorLogger = (description: string, attributes: KeyValuePair<string, unknown>, error?: Error) => Result<void>

type AuditLogger = {
  logEvent: EventLogger
  logError: ErrorLogger
}

export type { EventLogger, ErrorLogger }
export default AuditLogger
