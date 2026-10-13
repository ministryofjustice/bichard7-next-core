import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"

import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import Permission from "@moj-bichard7/common/types/Permission"
import { isError } from "@moj-bichard7/common/types/Result"
import UnlockReason from "@moj-bichard7/common/types/UnlockReason"
import { isServiceUser, userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { ApiAuditLogEvent } from "../../../types/AuditLogEvent"
import type { TransactionConnection } from "../../../types/DatabaseGateway"

import unlockExceptions from "../../../services/db/cases/unlockExceptions"
import unlockTriggers from "../../../services/db/cases/unlockTriggers"
import { NotAllowedError } from "../../../types/errors/NotAllowedError"
import buildAuditLogEvent from "../../auditLog/buildAuditLogEvent"

const appendAuditLogEvent = (auditLogEvents: ApiAuditLogEvent[], user: User, eventCode: EventCode) => {
  auditLogEvents.push(
    buildAuditLogEvent(eventCode, EventCategory.information, "Bichard New UI", {
      auditLogVersion: 2,
      user: user.username
    })
  )
}

const checkPermissions = (user: User, wantsTriggers: boolean, wantsExceptions: boolean): NotAllowedError | null => {
  if (isServiceUser(user)) {
    return new NotAllowedError("Service user does not have permission to unlock exceptions or triggers")
  }

  const access = userAccess(user)
  const canUnlockTriggers = access[Permission.Triggers]
  const canUnlockExceptions = access[Permission.Exceptions]

  if (wantsTriggers && wantsExceptions && (!canUnlockExceptions || !canUnlockTriggers)) {
    return new NotAllowedError("User does not have permission to unlock triggers and exceptions")
  }

  if (wantsExceptions && !canUnlockExceptions) {
    return new NotAllowedError("User does not have permission to unlock exceptions")
  }

  if (wantsTriggers && !canUnlockTriggers) {
    return new NotAllowedError("User does not have permission to unlock triggers")
  }

  return null
}

export const unlockAndAppendAuditEvents = async (
  tx: TransactionConnection,
  user: User,
  caseId: number,
  unlockReason: UnlockReason,
  auditLogEvents: ApiAuditLogEvent[],
  exceptionsLockedTo: null | string,
  triggersLockedTo: null | string
): PromiseResult<void> => {
  const wantsToUnlockTriggers =
    unlockReason === UnlockReason.Trigger || unlockReason === UnlockReason.TriggerAndException
  const wantsToUnlockExceptions =
    unlockReason === UnlockReason.Exception || unlockReason === UnlockReason.TriggerAndException

  const permissionError = checkPermissions(user, wantsToUnlockTriggers, wantsToUnlockExceptions)
  if (permissionError) {
    return permissionError
  }

  if (wantsToUnlockExceptions && exceptionsLockedTo) {
    const exceptionUnlockedResult = await unlockExceptions(tx, caseId)
    if (isError(exceptionUnlockedResult)) {
      return exceptionUnlockedResult
    }

    appendAuditLogEvent(auditLogEvents, user, EventCode.ExceptionsUnlocked)
  }

  if (wantsToUnlockTriggers && triggersLockedTo) {
    const triggerUnlockedResult = await unlockTriggers(tx, caseId)
    if (isError(triggerUnlockedResult)) {
      return triggerUnlockedResult
    }

    appendAuditLogEvent(auditLogEvents, user, EventCode.TriggersUnlocked)
  }
}
