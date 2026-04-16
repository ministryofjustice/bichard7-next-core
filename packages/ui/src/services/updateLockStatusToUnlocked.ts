import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import getAuditLogEvent from "@moj-bichard7/core/lib/auditLog/getAuditLogEvent"
import type { EntityManager, Repository, UpdateResult } from "typeorm"
import { isError } from "types/Result"
import UnlockReason from "types/UnlockReason"
import { AUDIT_LOG_EVENT_SOURCE } from "../config"
import Permission from "@moj-bichard7/common/types/Permission"
import CourtCase from "./entities/CourtCase"
import type User from "./entities/User"

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
  events: AuditLogEvent[],
  usingApiResubmit: boolean = false
): Promise<UpdateResult | Error | undefined> => {
  if (!courtCase) {
    throw new Error("Failed to unlock: Case not found")
  }

  const wantsToUnlockExceptions =
    unlockReason === UnlockReason.TriggerAndException || unlockReason === UnlockReason.Exception
  const wantsToUnlockTriggers =
    unlockReason === UnlockReason.TriggerAndException || unlockReason === UnlockReason.Trigger

  const hasExceptionPerm = user.hasAccessTo[Permission.Exceptions]
  const hasTriggerPerm = user.hasAccessTo[Permission.Triggers]

  const shouldUnlockExceptions = hasExceptionPerm && wantsToUnlockExceptions
  const shouldUnlockTriggers = hasTriggerPerm && wantsToUnlockTriggers

  if (!shouldUnlockExceptions && !shouldUnlockTriggers) {
    return new Error("User hasn't got permission to unlock the case")
  }

  const hasExceptionLock = !!courtCase.errorLockedByUsername
  const hasTriggerLock = !!courtCase.triggerLockedByUsername

  if (!hasExceptionLock && !hasTriggerLock) {
    return undefined
  }

  const canUnlockExistingException = hasExceptionPerm && hasExceptionLock
  const canUnlockExistingTrigger = hasTriggerPerm && hasTriggerLock

  if (!canUnlockExistingException && !canUnlockExistingTrigger) {
    if (usingApiResubmit) {
      return undefined
    }

    return new Error("User does not have permission to unlock this specific case")
  }

  let result: UpdateResult | Error | undefined
  const courtCaseRepository = dataSource.getRepository(CourtCase)

  if (shouldUnlockExceptions && hasExceptionLock) {
    result = await unlock("Exception", courtCaseRepository, courtCase.errorId, user, events)
    if (isError(result)) {
      return result
    }
  }

  if (shouldUnlockTriggers && hasTriggerLock) {
    result = await unlock("Trigger", courtCaseRepository, courtCase.errorId, user, events)
    if (isError(result)) {
      return result
    }
  }

  return result
}

export default updateLockStatusToUnlocked
