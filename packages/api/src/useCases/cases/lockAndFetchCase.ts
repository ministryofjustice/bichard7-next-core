import type { FastifyBaseLogger } from "fastify"
import type postgres from "postgres"

import EventCategory from "@moj-bichard7/common/types/EventCategory"

import type { AuditLogDynamoGateway } from "../../services/gateways/dynamo"
import type DataStoreGateway from "../../services/gateways/interfaces/dataStoreGateway"
import type { ApiAuditLogEvent } from "../../types/AuditLogEvent"

import EventCode from "../../types/EventCode"
import { LockReason } from "../../types/LockReason"
import buildAuditLogEvent from "../auditLog/buildAuditLogEvent"
import createAuditLogEvents from "../createAuditLogEvents"

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
      // TODO: Check permissions for Exceptions and Triggers
      // TODO: Lock Triggers and AuditLog them
      const exceptionLockedResult = await dataStore.lockCase(callbackSql, LockReason.Exception, caseId, username)

      if (exceptionLockedResult) {
        auditLogEvents.push(
          buildAuditLogEvent(EventCode.ExceptionsLocked, EventCategory.information, "Bichard New UI", {
            auditLogVersion: 2,
            user: username
          })
        )
      }

      if (auditLogEvents.length > 0) {
        createAuditLogEvents(auditLogEvents, caseMessageId, auditLogGateway, logger)
      }
    })
    .catch(async (err) => {
      logger?.error(err.message)
    })

  return await dataStore.fetchCase(caseId)
}
