import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"

import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import Permission from "@moj-bichard7/common/types/Permission"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type DataStoreGateway from "../../services/gateways/interfaces/dataStoreGateway"
import type { ApiAuditLogEvent } from "../../types/AuditLogEvent"

import { LockReason } from "../../types/LockReason"
import buildAuditLogEvent from "../auditLog/buildAuditLogEvent"

export const lockTriggers = async (
  dataStore: DataStoreGateway,
  callbackSql: postgres.Sql,
  caseId: number,
  user: User,
  auditLogEvents: ApiAuditLogEvent[]
): Promise<void> => {
  if (!userAccess(user)[Permission.Triggers]) {
    return
  }

  const triggerLocked = await dataStore.lockCase(callbackSql, LockReason.Trigger, caseId, user.username)

  if (triggerLocked) {
    auditLogEvents.push(
      buildAuditLogEvent(EventCode.TriggersLocked, EventCategory.information, "Bichard New UI", {
        auditLogVersion: 2,
        user: user.username
      })
    )
  }
}
