import getAuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/core/lib/getAuditLogEvent"
import { type AuditLogEvent } from "@moj-bichard7-developers/bichard7-next-core/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7-developers/bichard7-next-core/common/types/EventCategory"
import { DataSource, In, IsNull, UpdateResult } from "typeorm"
import { isError } from "types/Result"
import { AUDIT_LOG_EVENT_SOURCE } from "../config"
import UnlockReason from "../types/UnlockReason"
import CourtCase from "./entities/CourtCase"
import Trigger from "./entities/Trigger"
import User from "./entities/User"
import getCourtCaseByOrganisationUnit from "./getCourtCaseByOrganisationUnit"
import { storeMessageAuditLogEvents } from "./storeAuditLogEvents"
import updateLockStatusToUnlocked from "./updateLockStatusToUnlocked"
import EventCode from "@moj-bichard7-developers/bichard7-next-core/common/types/EventCode"

const generateTriggersAttributes = (triggers: Trigger[]) =>
  triggers.reduce((acc: Record<string, unknown>, trigger, index) => {
    const offenceNumberText =
      trigger.triggerItemIdentity && trigger.triggerItemIdentity > 0 ? ` (${trigger.triggerItemIdentity})` : ""
    acc[`Trigger ${index + 1} Details`] = `${trigger.triggerCode}${offenceNumberText}`
    return acc
  }, {})

const resolveTriggers = async (
  dataSource: DataSource,
  triggerIds: number[],
  courtCaseId: number,
  user: User
): Promise<UpdateResult | Error> => {
  const resolver = user.username

  return dataSource.transaction("SERIALIZABLE", async (entityManager) => {
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

    const areAllTriggersResolved = allTriggers.filter((trigger) => trigger.resolvedAt).length === allTriggers.length

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

export default resolveTriggers
