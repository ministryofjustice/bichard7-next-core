import type { EntityManager, Repository, UpdateResult } from "typeorm"
import CourtCase from "./entities/CourtCase"
import type User from "./entities/User"
import type { AuditLogEvent } from "@moj-bichard7-developers/bichard7-next-core/common/types/AuditLogEvent"
import { isError } from "types/Result"
import UnlockReason from "types/UnlockReason"
import { AUDIT_LOG_EVENT_SOURCE } from "../config"
import EventCategory from "@moj-bichard7-developers/bichard7-next-core/common/types/EventCategory"
import Permission from "types/Permission"
import EventCode from "@moj-bichard7-developers/bichard7-next-core/common/types/EventCode"
import getAuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/core/lib/getAuditLogEvent"

const unlock = async (
  unlockReason: "Trigger" | "Exception",
  courtCaseRepository: Repository<CourtCase>,
  courtCaseId: number,
  user: User,
  events: AuditLogEvent[]
): Promise<UpdateResult | Error> => {
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
          user: user.username,
          auditLogVersion: 2
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
): Promise<UpdateResult | Error> => {
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

  let result: UpdateResult | Error | undefined
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
