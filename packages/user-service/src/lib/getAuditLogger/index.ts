import type { GetServerSidePropsContext } from "next"
import type { EventLogger } from "types/AuditLogger"
import type AuditLogger from "types/AuditLogger"
import type { UserServiceConfig } from "../config"
import getConsoleEventLogger from "./getConsoleEventLogger"
import getApiEventLogger from "./getApiEventLogger"
import getErrorLogger from "./getErrorLogger"

export default (context: GetServerSidePropsContext, config: UserServiceConfig): AuditLogger => {
  let { auditLogger } = context as unknown as { auditLogger: AuditLogger }

  if (auditLogger) {
    return auditLogger
  }

  let eventLogger: EventLogger
  if (config.auditLoggerType === "console") {
    eventLogger = getConsoleEventLogger(context)
  } else if (config.auditLoggerType === "audit-log-api") {
    eventLogger = getApiEventLogger(context, config)
  } else {
    throw new Error("Unknown audit logger type.")
  }

  auditLogger = { logEvent: eventLogger, logError: getErrorLogger(context) }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(context as any).auditLogger = auditLogger

  return auditLogger
}
