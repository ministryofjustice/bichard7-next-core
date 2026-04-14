import type { UserServiceConfig } from "lib/config"
import type { GetServerSidePropsContext } from "next"
import type { EventLogger } from "types/AuditLogger"
import type PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import logger from "utils/logger"
import generateAuditLog from "./generateAuditLog"

enum HttpStatus {
  Created = 201
}

const getApiEventLogger =
  (context: GetServerSidePropsContext, config: UserServiceConfig): EventLogger =>
  async (event, attributes): PromiseResult<void> => {
    try {
      const {
        timestamp,
        description,
        eventCode,
        username,
        userIp,
        requestUri,
        attributes: auditAttributes
      } = generateAuditLog(context, event.code, event.description, attributes)

      const userEvent = {
        eventSource: "User Service",
        category: "information",
        eventType: description,
        timestamp: `${timestamp.toISOString()}`,
        attributes: {
          auditLogVersion: "2",
          eventCode,
          "Request URI": requestUri,
          "User IP": userIp,
          ...auditAttributes
        }
      }

      const headers = new Headers()
      headers.set("Content-Type", "application/json")

      if (config.auditLogApiKey) {
        headers.set("X-API-KEY", config.auditLogApiKey)
      }

      const apiResult = await fetch(`${config.auditLogApiUrl}/users/${username}/events`, {
        headers,
        method: "POST",
        body: JSON.stringify(userEvent)
      })

      if (apiResult.status !== HttpStatus.Created) {
        const responseData = await apiResult.text()

        return new Error(`Could not log event. API returned ${apiResult.status}. ${responseData}`)
      }
    } catch (error) {
      logger.error(error)
      return isError(error) ? error : Error("Error writing to log")
    }
  }

export default getApiEventLogger
