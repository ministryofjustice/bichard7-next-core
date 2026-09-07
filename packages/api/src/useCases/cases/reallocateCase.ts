import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import { parseHearingOutcome } from "@moj-bichard7/common/aho/parseHearingOutcome"
import { isError } from "@moj-bichard7/common/types/Result"
import Phase from "@moj-bichard7/core/types/Phase"

import type { AuditLogDynamoGateway } from "../../services/gateways/dynamo"
import type { WritableDatabaseConnection } from "../../types/DatabaseGateway"

import fetchCase from "../../services/db/cases/fetchCase"

const reallocate = async (
  auditLogGateway: AuditLogDynamoGateway,
  database: WritableDatabaseConnection,
  user: User,
  logger: FastifyBaseLogger,
  caseId: number,
  forceCode: string,
  note: string
): PromiseResult<void> => {
  const courtCase = await fetchCase(database, user, caseId, logger)
  // const courtCase = await getCourtCaseByOrganisationUnit(entityManager, courtCaseId, user)
  if (isError(courtCase)) {
    throw courtCase
  }

  if (!courtCase) {
    throw new Error("Failed to reallocate: Case not found")
  }

  const ahoResult = parseHearingOutcome(courtCase.hearingOutcome)
  if (isError(ahoResult)) {
    throw ahoResult
  }

  const currentForceOwner = ahoResult.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.OrganisationUnitCode
  if (currentForceOwner === forceCode) {
    return
  }

  const isCaseRecordableOnPnc = !!ahoResult.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator
  const hasNoExceptionsOrAllResolved = !courtCase.errorStatus || courtCase.errorStatus === "Resolved"
  const triggersPhase =
    courtCase.phase === Phase.PNC_UPDATE && isCaseRecordableOnPnc && hasNoExceptionsOrAllResolved
      ? Phase.PNC_UPDATE
      : Phase.HEARING_OUTCOME

  // const triggers = generateTriggers(ahoResult, triggersPhase)

  //   if (hasNoExceptionsOrAllResolved) {
  //     triggers.push({ code: REALLOCATE_CASE_TRIGGER_CODE } as Trigger)
  //   }

  //   const { triggersToAdd, triggersToDelete } = recalculateTriggers(courtCase.triggers, triggers)

  //   const updateTriggersResult = await updateTriggers(
  //     entityManager,
  //     courtCase,
  //     triggersToAdd,
  //     triggersToDelete,
  //     courtCase.errorStatus === "Unresolved",
  //     user,
  //     events
  //   )
  //   if (isError(updateTriggersResult)) {
  //     throw updateTriggersResult
  //   }

  //   const amendedCourtCase = await amendCourtCase(entityManager, { forceOwner: forceCode }, courtCase, user)
  //   if (isError(amendedCourtCase)) {
  //     throw amendedCourtCase
  //   }

  //   const updatedAhoResult = parseHearingOutcome(
  //     amendedCourtCase.updatedHearingOutcome ?? amendedCourtCase.hearingOutcome
  //   )
  //   if (isError(updatedAhoResult)) {
  //     throw updatedAhoResult
  //   }

  //   const updateCourtCaseResult = await updateCourtCase(
  //     entityManager,
  //     courtCase,
  //     updatedAhoResult,
  //     triggersToAdd.length > 0 || triggersToDelete.length > 0
  //   )

  //   if (isError(updateCourtCaseResult)) {
  //     throw updateCourtCaseResult
  //   }

  //   const newForceCode = updatedAhoResult.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.OrganisationUnitCode
  //   const addNoteResult = await insertNotes(entityManager, [
  //     {
  //       noteText: `${user.username}: Case reallocated to new force owner: ${newForceCode}`,
  //       errorId: caseId,
  //       userId: "System"
  //     }
  //   ])
  //   if (isError(addNoteResult)) {
  //     throw addNoteResult
  //   }

  //   if (note) {
  //     const addUserNoteResult = await insertNotes(entityManager, [
  //       {
  //         noteText: note,
  //         errorId: caseId,
  //         userId: user.username
  //       }
  //     ])
  //     if (isError(addUserNoteResult)) {
  //       throw addUserNoteResult
  //     }
  //   }

  //   events.push(
  //     getAuditLogEvent(EventCode.HearingOutcomeReallocated, EventCategory.information, AUDIT_LOG_EVENT_SOURCE, {
  //       user: user.username,
  //       auditLogVersion: 2,
  //       "New Force Owner": `${newForceCode}`
  //     })
  //   )

  //   const unlockResult = await updateLockStatusToUnlocked(
  //     entityManager,
  //     courtCase,
  //     user,
  //     UnlockReason.TriggerAndException,
  //     events
  //   )
  //   if (isError(unlockResult)) {
  //     throw unlockResult
  //   }

  //   await storeMessageAuditLogEvents(courtCase.messageId, events)
  // })
  // .catch((error) => error)
}

export default reallocate
