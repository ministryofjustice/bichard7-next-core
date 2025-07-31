import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import getAuditLogEvent from "@moj-bichard7/core/lib/auditLog/getAuditLogEvent"
import generateTriggers from "@moj-bichard7/core/lib/triggers/generateTriggers"
import Phase from "@moj-bichard7/core/types/Phase"
import type { Trigger } from "@moj-bichard7/core/types/Trigger"
import { retryTransaction } from "services/retryTransaction"
import type { DataSource, EntityManager, UpdateResult } from "typeorm"
import { isError } from "types/Result"
import UnlockReason from "types/UnlockReason"
import parseHearingOutcome from "utils/parseHearingOutcome"
import { AUDIT_LOG_EVENT_SOURCE, REALLOCATE_CASE_TRIGGER_CODE } from "../../config"
import amendCourtCase from "../amendCourtCase"
import type User from "../entities/User"
import getCourtCaseByOrganisationUnit from "../getCourtCaseByOrganisationUnit"
import insertNotes from "../insertNotes"
import { storeMessageAuditLogEvents } from "../storeAuditLogEvents"
import updateLockStatusToUnlocked from "../updateLockStatusToUnlocked"
import recalculateTriggers from "./recalculateTriggers"
import updateCourtCase from "./updateCourtCase"
import updateTriggers from "./updateTriggers"

const reallocateCourtCaseToForceTransaction = async (
  dataSource: DataSource | EntityManager,
  courtCaseId: number,
  user: User,
  forceCode: string,
  note?: string
) => {
  await dataSource.transaction("SERIALIZABLE", async (entityManager): Promise<void> => {
    const events: AuditLogEvent[] = []

    const courtCase = await getCourtCaseByOrganisationUnit(entityManager, courtCaseId, user)
    if (isError(courtCase)) {
      throw courtCase
    }

    if (!courtCase) {
      throw new Error("Failed to reallocate: Case not found")
    }

    const aho = parseHearingOutcome(courtCase.hearingOutcome)
    if (isError(aho)) {
      throw aho
    }

    const isCaseRecordableOnPnc = !!aho.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator
    const hasNoExceptionsOrAllResolved = !courtCase.errorStatus || courtCase.errorStatus === "Resolved"
    const triggersPhase =
      courtCase.phase === Phase.PNC_UPDATE && isCaseRecordableOnPnc && hasNoExceptionsOrAllResolved
        ? Phase.PNC_UPDATE
        : Phase.HEARING_OUTCOME

    const triggers = generateTriggers(aho, triggersPhase)

    if (hasNoExceptionsOrAllResolved) {
      triggers.push({ code: REALLOCATE_CASE_TRIGGER_CODE } as Trigger)
    }

    const { triggersToAdd, triggersToDelete } = recalculateTriggers(courtCase.triggers, triggers)

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

    const updatedAho = parseHearingOutcome(amendedCourtCase.updatedHearingOutcome ?? amendedCourtCase.hearingOutcome)
    if (isError(updatedAho)) {
      throw updatedAho
    }

    const updateCourtCaseResult = await updateCourtCase(
      entityManager,
      courtCase,
      updatedAho,
      triggersToAdd.length > 0 || triggersToDelete.length > 0
    )

    if (isError(updateCourtCaseResult)) {
      throw updateCourtCaseResult
    }

    const newForceCode = updatedAho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.OrganisationUnitCode
    const addNoteResult = await insertNotes(entityManager, [
      {
        noteText: `${user.username}: Case reallocated to new force owner: ${newForceCode}`,
        errorId: courtCaseId,
        userId: "System"
      }
    ])
    if (isError(addNoteResult)) {
      throw addNoteResult
    }

    if (note) {
      const addUserNoteResult = await insertNotes(entityManager, [
        {
          noteText: note,
          errorId: courtCaseId,
          userId: user.username
        }
      ])
      if (isError(addUserNoteResult)) {
        throw addUserNoteResult
      }
    }

    events.push(
      getAuditLogEvent(EventCode.HearingOutcomeReallocated, EventCategory.information, AUDIT_LOG_EVENT_SOURCE, {
        user: user.username,
        auditLogVersion: 2,
        "New Force Owner": `${newForceCode}`
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

    const storeAuditLogResponse = await storeMessageAuditLogEvents(courtCase.messageId, events).catch((error) => error)
    if (isError(storeAuditLogResponse)) {
      throw storeAuditLogResponse
    }
  })
}

const reallocateCourtCaseToForce = async (
  dataSource: DataSource | EntityManager,
  courtCaseId: number,
  user: User,
  forceCode: string,
  note?: string
): Promise<UpdateResult | Error> => {
  return await retryTransaction(
    reallocateCourtCaseToForceTransaction,
    dataSource,
    courtCaseId,
    user,
    forceCode,
    note
  ).catch((error) => error)
}

export default reallocateCourtCaseToForce
