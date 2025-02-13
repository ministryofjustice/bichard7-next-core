import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"
import type postgres from "postgres"

import { isError } from "@moj-bichard7/common/types/Result"

import type { AuditLogDynamoGateway } from "../../services/gateways/dynamo"
import type DataStoreGateway from "../../services/gateways/interfaces/dataStoreGateway"
import type { ApiAuditLogEvent } from "../../types/AuditLogEvent"

import createAuditLogEvents from "../createAuditLogEvents"
import { lockExceptions } from "./lockExceptions"
import { lockTriggers } from "./lockTriggers"

export const lockAndAuditLog = async (
  dataStore: DataStoreGateway,
  caseId: number,
  callbackSql: postgres.Sql<{}>,
  user: User,
  auditLogGateway: AuditLogDynamoGateway,
  logger?: FastifyBaseLogger
): Promise<void> => {
  const auditLogEvents: ApiAuditLogEvent[] = []

  const caseMessageId = (await dataStore.selectCaseMessageId(caseId)).message_id

  await lockExceptions(dataStore, callbackSql, caseId, user, auditLogEvents)

  await lockTriggers(dataStore, callbackSql, caseId, user, auditLogEvents)

  if (auditLogEvents.length > 0) {
    const result = await createAuditLogEvents(auditLogEvents, caseMessageId, auditLogGateway, logger)

    if (isError(result)) {
      throw result
    }
  }
}
