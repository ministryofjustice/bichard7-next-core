import type { FastifyBaseLogger } from "fastify"
import type postgres from "postgres"

import type { AuditLogDynamoGateway } from "../../services/gateways/dynamo"
import type DataStoreGateway from "../../services/gateways/interfaces/dataStoreGateway"
import type { ApiAuditLogEvent } from "../../types/AuditLogEvent"

import createAuditLogEvents from "../createAuditLogEvents"
import { lockExceptions } from "./lockExceptions"

export const lockAndFetchCase = async (
  dataStore: DataStoreGateway,
  auditLogGateway: AuditLogDynamoGateway,
  caseId: number,
  username: string,
  logger?: FastifyBaseLogger
) => {
  await dataStore
    .transaction(async (callbackSql: postgres.Sql) => {
      const auditLogEvents: ApiAuditLogEvent[] = []

      const caseMessageId = (await dataStore.selectCaseMessageId(caseId)).message_id

      await lockExceptions(dataStore, callbackSql, caseId, username, auditLogEvents)

      // TODO: Check permissions for Triggers
      // TODO: Lock Triggers and AuditLog them

      if (auditLogEvents.length > 0) {
        createAuditLogEvents(auditLogEvents, caseMessageId, auditLogGateway, logger)
      }
    })
    .catch(async (err) => {
      logger?.error(err.message)
    })

  return await dataStore.fetchCase(caseId)
}
