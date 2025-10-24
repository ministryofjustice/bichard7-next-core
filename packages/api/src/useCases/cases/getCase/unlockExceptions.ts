import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"

import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import Permission from "@moj-bichard7/common/types/Permission"
import { isError } from "@moj-bichard7/common/types/Result"
import { isServiceUser, userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { ApiAuditLogEvent } from "../../../types/AuditLogEvent"
import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

import unlockException from "../../../services/db/cases/unlockException"
import buildAuditLogEvent from "../../auditLog/buildAuditLogEvent"

export const unlockExceptions = async (
  database: WritableDatabaseConnection,
  user: User,
  caseId: number,
  auditLogEvents: ApiAuditLogEvent[],
  eventSource: string = "Bichard New UI"
): PromiseResult<void> => {
  if (!(userAccess(user)[Permission.Exceptions] || isServiceUser(user))) {
    return
  }

  const exceptionUnlockedResult = await unlockException(database, user, caseId)
  if (isError(exceptionUnlockedResult)) {
    return exceptionUnlockedResult
  }

  if (exceptionUnlockedResult) {
    auditLogEvents.push(
      buildAuditLogEvent(EventCode.ExceptionsUnlocked, EventCategory.information, eventSource, {
        auditLogVersion: 2,
        user: user.username
      })
    )
  }
}
