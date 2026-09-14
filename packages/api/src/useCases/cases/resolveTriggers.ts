import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

// import { isError } from "types/Result"
// import getSystemNotesForTriggers from "utils/getSystemNotesForTriggers"
// import { AUDIT_LOG_EVENT_SOURCE } from "../config"
// import UnlockReason from "../types/UnlockReason"
// import CourtCase from "./entities/CourtCase"
// import Trigger from "./entities/Trigger"
// import type User from "./entities/User"
// import getCourtCaseByOrganisationUnit from "./getCourtCaseByOrganisationUnit"
// import insertNotes from "./insertNotes"
// import { storeMessageAuditLogEvents } from "./storeAuditLogEvents"
// import updateLockStatusToUnlocked from "./updateLockStatusToUnlocked"
import { isError } from "@moj-bichard7/common/types/Result"

import type { ApiAuditLogEvent } from "../../types/AuditLogEvent"
import type { WritableDatabaseConnection } from "../../types/DatabaseGateway"

import fetchCase from "../../services/db/cases/fetchCase"
import getSystemNotesForTriggers from "../../services/db/cases/getSystemNotesForTriggers"
import insertNotes from "../../services/db/cases/insertNotes"
import { NotFoundError } from "../../types/errors/NotFoundError"
import { getAllTriggers } from "./getCase/getAllTriggers"
import { updateTriggers } from "./getCase/updateTriggers"

const resolveTriggers = async (
  database: WritableDatabaseConnection,
  logger: FastifyBaseLogger,
  triggerIds: number[],
  courtCaseId: number,
  user: User
): Promise<void> => {
  const resolver = user.username
  const auditLogEvents: ApiAuditLogEvent[] = []

  await database.transaction(async (tx) => {
    const courtCase = await fetchCase(tx, user, courtCaseId, logger)
    if (isError(courtCase)) {
      throw courtCase
    }

    if (!courtCase) {
      throw Error("Court case not found")
    }

    const triggersToResolve = courtCase.triggers.filter(
      (trigger) => triggerIds.includes(trigger.triggerId) && !trigger.resolvedAt
    )

    if (triggersToResolve.length === 0) {
      return new NotFoundError()
    }

    const unresolvedTriggerIds = triggersToResolve.map((trigger) => trigger.triggerId)

    // refactor into separate function?
    if (!!courtCase.triggerLockedByUsername && courtCase.triggerLockedByUsername === user.username) {
      throw Error(`Triggers are not locked by the user - ${courtCaseId}`)
    }

    const updateTriggersResult = await updateTriggers(tx, user, unresolvedTriggerIds, auditLogEvents)
    if (isError(updateTriggersResult)) {
      throw updateTriggersResult
    }

    if (updateTriggersResult !== unresolvedTriggerIds.length) {
      throw Error(`Failed to resolve triggers - ${courtCaseId}`)
    }

    const addNoteResult = await insertNotes(
      tx,
      getSystemNotesForTriggers(
        triggersToResolve.map((a) => a.triggerCode),
        resolver
      ),
      "System",
      courtCaseId
    )

    if (isError(addNoteResult)) {
      throw addNoteResult
    }

    const allTriggers = await getAllTriggers(tx, courtCaseId)
    if (isError(allTriggers)) {
      throw allTriggers
    }

    // const triggersVisibleToUser = user.excludedTriggers
    //   ? allTriggers.filter((trigger) => !user.excludedTriggers.includes(trigger.trigger_code))
    //   : allTriggers

    // const areAllTriggersResolved = allTriggers.filter((trigger) => trigger.resolved_ts).length === allTriggers.length

    // const allTriggersVisibleToUserResolved =
    //   triggersVisibleToUser.filter((trigger) => trigger.resolved_ts).length === triggersVisibleToUser.length

    /*   if (areAllTriggersResolved) {
      const hasUnresolvedExceptions = courtCase.errorCount > 0 && courtCase.errorResolvedTimestamp === null
      const updateCaseResult = await tx
        .getRepository(CourtCase)
        .update(
          {
            errorId: courtCaseId,
            triggerResolvedBy: IsNull(),
            triggerResolvedTimestamp: IsNull()
          },
          {
            resolutionTimestamp: hasUnresolvedExceptions ? null : new Date(),
            triggerResolvedBy: resolver,
            triggerResolvedTimestamp: new Date(),
            triggerStatus: "Resolved"
          }
        )
        .catch((error) => error)

      if (isError(updateCaseResult)) {
        throw updateCaseResult
      }

      if (updateCaseResult.affected && updateCaseResult.affected > 0) {
        // appendAuditLog
        events.push(
          getAuditLogEvent(EventCode.AllTriggersResolved, EventCategory.information, AUDIT_LOG_EVENT_SOURCE, {
            auditLogVersion: 2,
            "Number Of Triggers": allTriggers.length,
            user: user.username,
            ...generateTriggersAttributes(allTriggers)
          })
        )
      }
    }

    if (allTriggersVisibleToUserResolved) {
      const unlockResult = await updateLockStatusToUnlocked(tx, courtCase, user, UnlockReason.Trigger, events)

      if (isError(unlockResult)) {
        throw unlockResult
      }
    } */

    // createAuditLog
    /* await storeMessageAuditLogEvents(courtCase.messageId, events) */

    /*   if (auditLogEvents.length > 0) {
        const caseMessageId = await selectMessageId(tx, user, caseId)
        if (isError(caseMessageId)) {
          throw caseMessageId
        }

        const auditLogEventsResult = await createAuditLogEvents(auditLogEvents, caseMessageId, auditLogGateway, logger)
        if (isError(auditLogEventsResult)) {
          throw auditLogEventsResult
        }
      } */

    return updateTriggersResult
  })
}

export default resolveTriggers
