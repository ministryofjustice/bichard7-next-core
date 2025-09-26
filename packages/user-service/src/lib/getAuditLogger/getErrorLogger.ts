import { GetServerSidePropsContext } from "next"
import { ErrorLogger } from "types/AuditLogger"
import type KeyValuePair from "types/KeyValuePair"
import { isError, Result } from "types/Result"
import logger from "utils/logger"
import generateAuditLog from "./generateAuditLog"

const getErrorLogger =
  (context: GetServerSidePropsContext): ErrorLogger =>
  (description: string, attributes: KeyValuePair<string, unknown>, error?: Error): Result<void> => {
    try {
      const {
        auditLogId,
        timestamp,
        description: auditDescription,
        eventCode,
        username,
        userIp,
        requestUri,
        attributes: auditAttributes
      } = generateAuditLog(context, "error", description, attributes)

      logger.info({
        component: "[Audit Logger]",
        auditLogId,
        timestamp: timestamp.toISOString(),
        description: auditDescription,
        eventCode,
        username,
        userIp,
        requestUri,
        attributes: auditAttributes // pino stringifies objects to a depth of 5
      })
    } catch (e) {
      logger.error(e)
      return isError(e) ? e : Error("Error writing to log")
    }

    if (error) {
      logger.error(error)
    }
  }

export default getErrorLogger
