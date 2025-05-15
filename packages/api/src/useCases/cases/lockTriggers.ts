import type { User } from "@moj-bichard7/common/types/User"

import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import Permission from "@moj-bichard7/common/types/Permission"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { ApiAuditLogEvent } from "../../types/AuditLogEvent"
import type { DatabaseConnection } from "../../types/DatabaseGateway"

import lockTrigger from "../../services/db/cases/lockTrigger"
import buildAuditLogEvent from "../auditLog/buildAuditLogEvent"

export const lockTriggers = async (
  writableSql: DatabaseConnection,
  user: User,
  caseId: number,
  auditLogEvents: ApiAuditLogEvent[]
): Promise<void> => {
  if (!userAccess(user)[Permission.Triggers]) {
    return
  }

  const triggerLocked = await lockTrigger(writableSql, user, caseId)

  if (triggerLocked) {
    auditLogEvents.push(
      buildAuditLogEvent(EventCode.TriggersLocked, EventCategory.information, "Bichard New UI", {
        auditLogVersion: 2,
        user: user.username
      })
    )
  }
}
