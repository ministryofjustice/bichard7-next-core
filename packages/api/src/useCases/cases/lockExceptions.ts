import type postgres from "postgres"

import EventCategory from "@moj-bichard7/common/types/EventCategory"

import type DataStoreGateway from "../../services/gateways/interfaces/dataStoreGateway"
import type { ApiAuditLogEvent } from "../../types/AuditLogEvent"

import EventCode from "../../types/EventCode"
import { LockReason } from "../../types/LockReason"
import buildAuditLogEvent from "../auditLog/buildAuditLogEvent"

export const lockExceptions = async (
  dataStore: DataStoreGateway,
  callbackSql: postgres.Sql,
  caseId: number,
  username: string,
  auditLogEvents: ApiAuditLogEvent[]
): Promise<void> => {
  // TODO: Check permissions for Exceptions
  const exceptionLockedResult = await dataStore.lockCase(callbackSql, LockReason.Exception, caseId, username)

  if (exceptionLockedResult) {
    auditLogEvents.push(
      buildAuditLogEvent(EventCode.ExceptionsLocked, EventCategory.information, "Bichard New UI", {
        auditLogVersion: 2,
        user: username
      })
    )
  }
}
