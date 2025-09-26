import generateAuditLog from "./generateAuditLog"
import logger from "utils/logger"
import { isError } from "types/Result"
import type { GetServerSidePropsContext } from "next"
import type PromiseResult from "types/PromiseResult"
import type { EventLogger } from "types/AuditLogger"

const getConsoleEventLogger =
  (context: GetServerSidePropsContext): EventLogger =>
  (event, attributes): PromiseResult<void> => {
    try {
      const {
        auditLogId,
        timestamp,
        description,
        eventCode,
        username,
        userIp,
        requestUri,
        attributes: auditAttributes
      } = generateAuditLog(context, event.code, event.description, attributes)

      logger.info({
        component: "[Audit Logger]",
        auditLogId,
        timestamp: timestamp.toISOString(),
        description,
        eventCode,
        username,
        userIp,
        requestUri,
        attributes: auditAttributes // pino stringifies objects to a depth of 5
      })
    } catch (error) {
      logger.error(error)
      return Promise.resolve(isError(error) ? error : Error("Error writing to log"))
    }

    return Promise.resolve()
  }

export default getConsoleEventLogger
