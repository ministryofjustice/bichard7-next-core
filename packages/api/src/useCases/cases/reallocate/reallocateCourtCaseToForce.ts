import type { ReallocationBody } from "@moj-bichard7/common/contracts/ReallocationBody"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger } from "fastify"

import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"
import generateTriggers from "@moj-bichard7/core/lib/triggers/generateTriggers"
import Phase from "@moj-bichard7/core/types/Phase"

import type { AuditLogDynamoGateway } from "../../../services/gateways/dynamo"
import type { ApiAuditLogEvent } from "../../../types/AuditLogEvent"
import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

import fetchCase from "../../../services/db/cases/fetchCase"
import { NotAllowedError } from "../../../types/errors/NotAllowedError"
import canReallocateCourtCaseToForce from "./canReallocateCourtCaseToForce"

const reallocateCourtCaseToForce = async (
  auditLogGateway: AuditLogDynamoGateway,
  database: WritableDatabaseConnection,
  user: User,
  logger: FastifyBaseLogger,
  query: ReallocationBody,
  caseId: number
): PromiseResult<void> => {
  return await database
    .transaction(async (tx): Promise<void> => {
      const events: ApiAuditLogEvent[] = []

      const caseResult = await fetchCase(tx, user, caseId, logger)

      if (isError(caseResult)) {
        throw caseResult
      }

      if (!canReallocateCourtCaseToForce(caseResult, user)) {
        throw new NotAllowedError(`Can't reallocate case ${caseId}`)
      }

      const aho = caseResult.aho
      const currentForceOwner = aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.OrganisationUnitCode
      if (currentForceOwner === query.forceCode) {
        return
      }

      const isCaseRecordableOnPnc = !!aho.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator
      const hasNoExceptionsOrAllResolved = !caseResult.errorStatus || caseResult.errorStatus === "Resolved"
      const triggersPhase =
        caseResult.phase === Phase.PNC_UPDATE && isCaseRecordableOnPnc && hasNoExceptionsOrAllResolved
          ? Phase.PNC_UPDATE
          : Phase.HEARING_OUTCOME

      const triggers = generateTriggers(aho, triggersPhase)

      if (hasNoExceptionsOrAllResolved) {
        triggers.push({ code: REALLOCATE_CASE_TRIGGER_CODE } as Trigger)
      }

      /* const { triggersToAdd, triggersToDelete } = recalculateTriggers(courtCase.triggers, triggers) */
      /*  
      const updateTriggersResult = await updateTriggers(
        entityManager,
        courtCase,
        triggersToAdd,
        triggersToDelete,
        courtCase.errorStatus === "Unresolved",
        user,
        events
      )
      if (isError(updateTriggersResult)) {
        throw updateTriggersResult
      }

      const amendedCourtCase = await amendCourtCase(entityManager, { forceOwner: forceCode }, courtCase, user)
      if (isError(amendedCourtCase)) {
        throw amendedCourtCase
      }

      const updatedAhoResult = parseHearingOutcome(
        amendedCourtCase.updatedHearingOutcome ?? amendedCourtCase.hearingOutcome
      )
      if (isError(updatedAhoResult)) {
        throw updatedAhoResult
      }

      const updateCourtCaseResult = await updateCourtCase(
        entityManager,
        courtCase,
        updatedAhoResult,
        triggersToAdd.length > 0 || triggersToDelete.length > 0
      )

      if (isError(updateCourtCaseResult)) {
        throw updateCourtCaseResult
      }

      const newForceCode = updatedAhoResult.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.OrganisationUnitCode
      const addNoteResult = await insertNotes(entityManager, [
        {
          errorId: courtCaseId,
          noteText: `${user.username}: Case reallocated to new force owner: ${newForceCode}`,
          userId: "System"
        }
      ])
      if (isError(addNoteResult)) {
        throw addNoteResult
      }

      if (note) {
        const addUserNoteResult = await insertNotes(entityManager, [
          {
            errorId: courtCaseId,
            noteText: note,
            userId: user.username
          }
        ])
        if (isError(addUserNoteResult)) {
          throw addUserNoteResult
        }
      }

      events.push(
        getAuditLogEvent(EventCode.HearingOutcomeReallocated, EventCategory.information, AUDIT_LOG_EVENT_SOURCE, {
          auditLogVersion: 2,
          "New Force Owner": `${newForceCode}`,
          user: user.username
        })
      )

      const unlockResult = await updateLockStatusToUnlocked(
        entityManager,
        courtCase,
        user,
        UnlockReason.TriggerAndException,
        events
      )
      if (isError(unlockResult)) {
        throw unlockResult
      }

      await storeMessageAuditLogEvents(courtCase.messageId, events) */
    })
    .catch((error: Error) => error)
}

export default reallocateCourtCaseToForce
