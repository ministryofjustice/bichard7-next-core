import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"

import EventCategory from "@moj-bichard7/common/types/EventCategory"
import Permission from "@moj-bichard7/common/types/Permission"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type DataStoreGateway from "../../services/gateways/interfaces/dataStoreGateway"
import type { ApiAuditLogEvent } from "../../types/AuditLogEvent"

import EventCode from "../../types/EventCode"
import { LockReason } from "../../types/LockReason"
import buildAuditLogEvent from "../auditLog/buildAuditLogEvent"

export const lockExceptions = async (
  dataStore: DataStoreGateway,
  callbackSql: postgres.Sql,
  caseId: number,
  user: User,
  auditLogEvents: ApiAuditLogEvent[]
): Promise<void> => {
  if (!userAccess(user)[Permission.Exceptions]) {
    return
  }

  const exceptionLockedResult = await dataStore.lockCase(callbackSql, LockReason.Exception, caseId, user.username)

  if (exceptionLockedResult) {
    auditLogEvents.push(
      buildAuditLogEvent(EventCode.ExceptionsLocked, EventCategory.information, "Bichard New UI", {
        auditLogVersion: 2,
        user: user.username
      })
    )
  }
}
