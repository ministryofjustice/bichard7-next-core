import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"
import type postgres from "postgres"

import type { AuditLogDynamoGateway } from "../../services/gateways/dynamo"
import type DataStoreGateway from "../../services/gateways/interfaces/dataStoreGateway"

import { lockAndAuditLog } from "./lockAndAuditLog"

export const lockAndFetchCase = async (
  dataStore: DataStoreGateway,
  auditLogGateway: AuditLogDynamoGateway,
  caseId: number,
  user: User,
  logger?: FastifyBaseLogger
) => {
  await dataStore
    .transaction(async (callbackSql: postgres.Sql) => {
      await lockAndAuditLog(dataStore, caseId, callbackSql, user, auditLogGateway, logger)
    })
    .catch(async (err) => {
      logger?.error(err.message)
    })

  return await dataStore.fetchCase(caseId)
}
