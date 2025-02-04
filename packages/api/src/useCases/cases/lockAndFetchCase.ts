import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"
import type postgres from "postgres"

import { isError } from "@moj-bichard7/common/types/Result"

import type { AuditLogDynamoGateway } from "../../services/gateways/dynamo"
import type DataStoreGateway from "../../services/gateways/interfaces/dataStoreGateway"
import type { ApiAuditLogEvent } from "../../types/AuditLogEvent"

import createAuditLogEvents from "../createAuditLogEvents"
import { lockExceptions } from "./lockExceptions"

export const lockAndFetchCase = async (
  dataStore: DataStoreGateway,
  auditLogGateway: AuditLogDynamoGateway,
  caseId: number,
  user: User,
  logger?: FastifyBaseLogger
) => {
  await dataStore
    .transaction(async (callbackSql: postgres.Sql) => {
      const auditLogEvents: ApiAuditLogEvent[] = []

      const caseMessageId = (await dataStore.selectCaseMessageId(caseId)).message_id

      await lockExceptions(dataStore, callbackSql, caseId, user, auditLogEvents)

      // TODO: Check permissions for Triggers
      // TODO: Lock Triggers and AuditLog them

      if (auditLogEvents.length > 0) {
        const result = await createAuditLogEvents(auditLogEvents, caseMessageId, auditLogGateway, logger)

        if (isError(result)) {
          throw result
        }
      }
    })
    .catch(async (err) => {
      logger?.error(err.message)
    })

  return await dataStore.fetchCase(caseId)
}
