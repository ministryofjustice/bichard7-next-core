import { type AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import getAuditLogEvent from "@moj-bichard7/core/lib/auditLog/getAuditLogEvent"
import type { DataSource, UpdateResult } from "typeorm"
import { In, IsNull, QueryFailedError } from "typeorm"
import { isError } from "types/Result"
import getSystemNotesForTriggers from "utils/getSystemNotesForTriggers"
import { AUDIT_LOG_EVENT_SOURCE } from "../config"
import UnlockReason from "../types/UnlockReason"
import CourtCase from "./entities/CourtCase"
import Trigger from "./entities/Trigger"
import type User from "./entities/User"
import getCourtCaseByOrganisationUnit from "./getCourtCaseByOrganisationUnit"
import insertNotes from "./insertNotes"
import { storeMessageAuditLogEvents } from "./storeAuditLogEvents"
import updateLockStatusToUnlocked from "./updateLockStatusToUnlocked"

const generateTriggersAttributes = (triggers: Trigger[]) =>
  triggers.reduce((acc: Record<string, unknown>, trigger, index) => {
    const offenceNumberText =
      trigger.triggerItemIdentity && trigger.triggerItemIdentity > 0 ? ` (${trigger.triggerItemIdentity})` : ""
    acc[`Trigger ${index + 1} Details`] = `${trigger.triggerCode}${offenceNumberText}`
    return acc
  }, {})

const resolveTriggersInTransaction = async (
  dataSource: DataSource,
  triggerIds: number[],
  courtCaseId: number,
  user: User
): Promise<UpdateResult | Error> => {
  const resolver = user.username

  return await dataSource.transaction("SERIALIZABLE", async (entityManager) => {
    const courtCase = await getCourtCaseByOrganisationUnit(entityManager, courtCaseId, user)

    if (isError(courtCase)) {
      throw courtCase
    }

    if (!courtCase) {
      throw Error("Court case not found")
    }

    const areAnyTriggersResolved =
      courtCase.triggers.some((trigger) => triggerIds.includes(trigger.triggerId) && !!trigger.resolvedAt) ?? false
    if (areAnyTriggersResolved) {
      throw Error("One or more triggers are already resolved")
    }

    if (courtCase === null) {
      throw Error("Could not find the court case")
    }

    if (!courtCase.triggersAreLockedByCurrentUser(resolver)) {
      throw Error("Triggers are not locked by the user")
    }

    const updateTriggersResult = await entityManager.getRepository(Trigger).update(
      {
        triggerId: In(triggerIds),
        resolvedAt: IsNull(),
        resolvedBy: IsNull()
      },
      {
        resolvedAt: new Date(),
        resolvedBy: resolver,
        status: "Resolved"
      }
    )

    if (updateTriggersResult.affected && updateTriggersResult.affected !== triggerIds.length) {
      throw Error("Failed to resolve triggers")
    }

    const addNoteResult = await insertNotes(
      entityManager,
      getSystemNotesForTriggers(
        courtCase.triggers.filter((trigger) => triggerIds.includes(trigger.triggerId)),
        resolver,
        courtCase.errorId
      )
    )

    if (isError(addNoteResult)) {
      throw addNoteResult
    }

    const events: AuditLogEvent[] = []

    events.push(
      getAuditLogEvent(EventCode.TriggersResolved, EventCategory.information, AUDIT_LOG_EVENT_SOURCE, {
        user: user.username,
        auditLogVersion: 2,
        "Number Of Triggers": triggerIds.length,
        ...generateTriggersAttributes(courtCase.triggers.filter((trigger) => triggerIds.includes(trigger.triggerId)))
      })
    )

    const allTriggers = await entityManager.getRepository(Trigger).find({ where: { errorId: courtCaseId } })
    if (isError(allTriggers)) {
      throw allTriggers
    }

    const triggersVisibleToUser = user.excludedTriggers
      ? allTriggers.filter((trigger) => !user.excludedTriggers.includes(trigger.triggerCode))
      : allTriggers

    const areAllTriggersResolved = allTriggers.filter((trigger) => trigger.resolvedAt).length === allTriggers.length

    const allTriggersVisibleToUserResolved =
      triggersVisibleToUser.filter((trigger) => trigger.resolvedAt).length === triggersVisibleToUser.length

    if (areAllTriggersResolved) {
      const hasUnresolvedExceptions = courtCase.errorCount > 0 && courtCase.errorResolvedTimestamp === null
      const updateCaseResult = await entityManager
        .getRepository(CourtCase)
        .update(
          {
            errorId: courtCaseId,
            triggerResolvedBy: IsNull(),
            triggerResolvedTimestamp: IsNull()
          },
          {
            triggerResolvedBy: resolver,
            triggerResolvedTimestamp: new Date(),
            resolutionTimestamp: hasUnresolvedExceptions ? null : new Date(),
            triggerStatus: "Resolved"
          }
        )
        .catch((error) => error)

      if (isError(updateCaseResult)) {
        throw updateCaseResult
      }

      if (!updateCaseResult.affected || updateCaseResult.affected === 0) {
        throw Error("Failed to update court case")
      }

      events.push(
        getAuditLogEvent(EventCode.AllTriggersResolved, EventCategory.information, AUDIT_LOG_EVENT_SOURCE, {
          user: user.username,
          auditLogVersion: 2,
          "Number Of Triggers": allTriggers.length,
          ...generateTriggersAttributes(allTriggers)
        })
      )
    }

    if (allTriggersVisibleToUserResolved) {
      const unlockResult = await updateLockStatusToUnlocked(
        entityManager,
        courtCase,
        user,
        UnlockReason.Trigger,
        events
      )

      if (isError(unlockResult)) {
        throw unlockResult
      }
    }

    const storeAuditLogResponse = await storeMessageAuditLogEvents(courtCase.messageId, events)

    if (isError(storeAuditLogResponse)) {
      throw storeAuditLogResponse
    }

    return updateTriggersResult
  })
}

const resolveTriggers = async (
  dataSource: DataSource,
  triggerIds: number[],
  courtCaseId: number,
  user: User
): Promise<UpdateResult | Error> => {
  const maxRetries = 2
  let result

  for (let retries = 0; retries < maxRetries; retries++) {
    try {
      return await resolveTriggersInTransaction(dataSource, triggerIds, courtCaseId, user)
    } catch (error) {
      if (!(error instanceof QueryFailedError)) {
        throw error
      }

      result = error
    }
  }

  throw result
}

export default resolveTriggers
