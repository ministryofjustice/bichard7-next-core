import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import type { EntityManager, Repository, UpdateResult } from "typeorm"

import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import Permission from "@moj-bichard7/common/types/Permission"
import getAuditLogEvent from "@moj-bichard7/core/lib/getAuditLogEvent"
import { isError } from "types/Result"
import UnlockReason from "types/UnlockReason"

import type User from "./entities/User"

import { AUDIT_LOG_EVENT_SOURCE } from "../config"
import CourtCase from "./entities/CourtCase"

const unlock = async (
  unlockReason: "Exception" | "Trigger",
  courtCaseRepository: Repository<CourtCase>,
  courtCaseId: number,
  user: User,
  events: AuditLogEvent[]
): Promise<Error | UpdateResult> => {
  const updatedFieldName = {
    Exception: "errorLockedByUsername",
    Trigger: "triggerLockedByUsername"
  }[unlockReason]

  const query = courtCaseRepository
    .createQueryBuilder()
    .update(CourtCase)
    .set({ [updatedFieldName]: null })
    .where("error_id = :id", { id: courtCaseId })

  if (!user.hasAccessTo[Permission.UnlockOtherUsersCases]) {
    query.andWhere({ [updatedFieldName]: user.username })
  }

  const result = await query.execute().catch((error: Error) => error)

  if (isError(result)) {
    return result
  }

  if (result.affected && result.affected > 0) {
    events.push(
      getAuditLogEvent(
        unlockReason === "Exception" ? EventCode.ExceptionsUnlocked : EventCode.TriggersUnlocked,
        EventCategory.information,
        AUDIT_LOG_EVENT_SOURCE,
        {
          auditLogVersion: 2,
          user: user.username
        }
      )
    )
  }

  return result
}

const updateLockStatusToUnlocked = async (
  dataSource: EntityManager,
  courtCase: CourtCase,
  user: User,
  unlockReason: UnlockReason,
  events: AuditLogEvent[]
): Promise<Error | UpdateResult> => {
  const shouldUnlockExceptions =
    user.hasAccessTo[Permission.Exceptions] &&
    (unlockReason === UnlockReason.TriggerAndException || unlockReason === UnlockReason.Exception)
  const shouldUnlockTriggers =
    user.hasAccessTo[Permission.Triggers] &&
    (unlockReason === UnlockReason.TriggerAndException || unlockReason === UnlockReason.Trigger)

  if (!shouldUnlockExceptions && !shouldUnlockTriggers) {
    return new Error("User hasn't got permission to unlock the case")
  }

  if (!courtCase) {
    throw new Error("Failed to unlock: Case not found")
  }

  const anyLockUserHasPermissionToUnlock =
    (user.hasAccessTo[Permission.Exceptions] && courtCase.errorLockedByUsername) ||
    (user.hasAccessTo[Permission.Triggers] && courtCase.triggerLockedByUsername)

  if (!anyLockUserHasPermissionToUnlock) {
    return new Error("Case is not locked")
  }

  let result: Error | undefined | UpdateResult
  const courtCaseRepository = dataSource.getRepository(CourtCase)

  if (shouldUnlockExceptions && !!courtCase.errorLockedByUsername) {
    result = await unlock("Exception", courtCaseRepository, courtCase.errorId, user, events)
  }

  if (shouldUnlockTriggers && !!courtCase.triggerLockedByUsername) {
    result = await unlock("Trigger", courtCaseRepository, courtCase.errorId, user, events)
  }

  return result ?? new Error("Failed to unlock case")
}

export default updateLockStatusToUnlocked
