import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import { isError } from "@moj-bichard7/common/types/Result"

import type { AuditLogDynamoGateway } from "../../services/gateways/dynamo"
import type { ApiAuditLogEvent } from "../../types/AuditLogEvent"
import type { WritableDatabaseConnection } from "../../types/DatabaseGateway"

import selectMessageId from "../../services/db/cases/selectMessageId"
import createAuditLogEvents from "../createAuditLogEvents"
import { lockExceptions } from "./lockExceptions"
import { lockTriggers } from "./lockTriggers"

export const lockAndAuditLog = async (
  database: WritableDatabaseConnection,
  auditLogGateway: AuditLogDynamoGateway,
  user: User,
  caseId: number,
  logger?: FastifyBaseLogger
): PromiseResult<void> => {
  const auditLogEvents: ApiAuditLogEvent[] = []

  return database
    .transaction(async (db: WritableDatabaseConnection) => {
      const caseMessageId = await selectMessageId(db, user, caseId)
      if (isError(caseMessageId)) {
        throw caseMessageId
      }

      const lockExceptionsResult = await lockExceptions(db, user, caseId, auditLogEvents)
      if (isError(lockExceptionsResult)) {
        throw lockExceptionsResult
      }

      const lockTriggersResult = await lockTriggers(db, user, caseId, auditLogEvents)
      if (isError(lockTriggersResult)) {
        throw lockTriggersResult
      }

      if (auditLogEvents.length > 0) {
        const auditLogEventsResult = await createAuditLogEvents(auditLogEvents, caseMessageId, auditLogGateway, logger)
        if (isError(auditLogEventsResult)) {
          throw auditLogEventsResult
        }
      }
    })
    .catch((error: Error) => {
      logger?.error(error.message)
      return error
    })
}
