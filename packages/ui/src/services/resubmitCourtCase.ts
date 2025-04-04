import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import getAuditLogEvent from "@moj-bichard7/core/lib/auditLog/getAuditLogEvent"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "@moj-bichard7/core/types/PncUpdateDataset"
import { isPncUpdateDataset } from "@moj-bichard7/core/types/PncUpdateDataset"
import { AUDIT_LOG_EVENT_SOURCE } from "config"
import amendCourtCase from "services/amendCourtCase"
import type User from "services/entities/User"
import insertNotes from "services/insertNotes"
import updateCourtCaseStatus from "services/updateCourtCaseStatus"
import updateLockStatusToLocked from "services/updateLockStatusToLocked"
import updateLockStatusToUnlocked from "services/updateLockStatusToUnlocked"
import type { DataSource } from "typeorm"
import type { Amendments } from "types/Amendments"
import type PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import UnlockReason from "types/UnlockReason"
import getCourtCaseByOrganisationUnit from "./getCourtCaseByOrganisationUnit"
import type MqGateway from "./mq/types/MqGateway"
import { storeMessageAuditLogEvents } from "./storeAuditLogEvents"

const phase1ResubmissionQueue = process.env.PHASE_1_RESUBMIT_QUEUE_NAME ?? "PHASE_1_RESUBMIT_QUEUE"
const phase2ResubmissionQueue = process.env.PHASE_2_RESUBMIT_QUEUE_NAME ?? "PHASE_2_RESUBMIT_QUEUE"

type TransactionResult = { json: AnnotatedHearingOutcome | PncUpdateDataset; xml: string }

const resubmitCourtCase = async (
  dataSource: DataSource,
  mqGateway: MqGateway,
  amendments: Partial<Amendments>,
  courtCaseId: number,
  user: User
): PromiseResult<AnnotatedHearingOutcome | Error> => {
  const resultAho = await dataSource
    .transaction("SERIALIZABLE", async (entityManager): PromiseResult<TransactionResult> => {
      const events: AuditLogEvent[] = []

      const courtCase = await getCourtCaseByOrganisationUnit(entityManager, courtCaseId, user)
      if (isError(courtCase)) {
        throw courtCase
      }

      if (!courtCase) {
        throw new Error("Failed to resubmit: Case not found")
      }

      const lockResult = await updateLockStatusToLocked(entityManager, +courtCaseId, user, events)
      if (isError(lockResult)) {
        throw lockResult
      }

      const amendedAhoResult = await amendCourtCase(entityManager, amendments, courtCase, user)
      if (isError(amendedAhoResult)) {
        throw amendedAhoResult
      }

      const addNoteResult = await insertNotes(entityManager, [
        {
          noteText: `${user.username}: Portal Action: Resubmitted Message.`,
          errorId: courtCaseId,
          userId: "System"
        }
      ])

      if (isError(addNoteResult)) {
        throw addNoteResult
      }

      const statusResult = await updateCourtCaseStatus(entityManager, courtCase, "Error", "Submitted", user)

      if (isError(statusResult)) {
        return statusResult
      }

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

      events.push(
        getAuditLogEvent(
          isPncUpdateDataset(amendedAhoResult.json)
            ? EventCode.HearingOutcomeResubmittedPhase2
            : EventCode.HearingOutcomeResubmittedPhase1,
          EventCategory.information,
          AUDIT_LOG_EVENT_SOURCE,
          {
            user: user.username,
            auditLogVersion: 2
          }
        )
      )

      const storeAuditLogResponse = await storeMessageAuditLogEvents(courtCase.messageId, events).catch(
        (error) => error
      )

      if (isError(storeAuditLogResponse)) {
        throw storeAuditLogResponse
      }

      return amendedAhoResult
    })
    .catch((error: Error) => error)

  if (isError(resultAho)) {
    throw resultAho
  }

  // TODO: this doesn't look right - should it be in transaction??
  const destinationQueue = isPncUpdateDataset(resultAho.json) ? phase2ResubmissionQueue : phase1ResubmissionQueue
  const queueResult = await mqGateway.execute(resultAho.xml, destinationQueue)

  if (isError(queueResult)) {
    return queueResult
  }

  return resultAho.json
}

export default resubmitCourtCase
