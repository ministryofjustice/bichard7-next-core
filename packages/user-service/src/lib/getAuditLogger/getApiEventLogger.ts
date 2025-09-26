import axios from "axios"
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

      const apiResult = await axios.post(`users/${username}/events`, userEvent, {
        baseURL: config.auditLogApiUrl,
        headers: {
          "X-API-Key": config.auditLogApiKey
        }
      })

      if (apiResult.status !== HttpStatus.Created) {
        return Error(`Could not log event. API returned ${apiResult.status}. ${apiResult.data}`)
      }
    } catch (error) {
      logger.error(error)
      return isError(error) ? error : Error("Error writing to log")
    }
  }

export default getApiEventLogger
