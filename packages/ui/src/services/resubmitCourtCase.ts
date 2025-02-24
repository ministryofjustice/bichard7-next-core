import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import getAuditLogEvent from "@moj-bichard7/core/lib/auditLog/getAuditLogEvent"
import serialiseToAhoXml from "@moj-bichard7/core/lib/serialise/ahoXml/serialiseToXml"
import serialiseToPncUpdateDatasetXml from "@moj-bichard7/core/lib/serialise/pncUpdateDatasetXml/serialiseToXml"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "@moj-bichard7/core/types/PncUpdateDataset"
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

const resubmitCourtCase = async (
  dataSource: DataSource,
  mqGateway: MqGateway,
  form: Partial<Amendments>,
  courtCaseId: number,
  user: User
): PromiseResult<AnnotatedHearingOutcome | Error> => {
  try {
    let phase
    const resultAho = await dataSource.transaction(
      "SERIALIZABLE",
      async (entityManager): Promise<AnnotatedHearingOutcome | Error> => {
        const events: AuditLogEvent[] = []

        const courtCase = await getCourtCaseByOrganisationUnit(entityManager, courtCaseId, user)

        if (isError(courtCase)) {
          throw courtCase
        }

        if (!courtCase) {
          throw new Error("Failed to resubmit: Case not found")
        }

        phase = courtCase.phase

        const lockResult = await updateLockStatusToLocked(entityManager, +courtCaseId, user, events)
        if (isError(lockResult)) {
          throw lockResult
        }

        const amendedCourtCase = await amendCourtCase(entityManager, form, courtCase, user)
        if (isError(amendedCourtCase)) {
          throw amendedCourtCase
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
            phase === 1 ? EventCode.HearingOutcomeResubmittedPhase1 : EventCode.HearingOutcomeResubmittedPhase2,
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

        return amendedCourtCase
      }
    )

    if (isError(resultAho)) {
      throw resultAho
    }

    // TODO: this doesn't look right - should it be in transaction??
    const destinationQueue = phase === 1 ? phase1ResubmissionQueue : phase2ResubmissionQueue
    const generatedXml =
      phase === 1
        ? serialiseToAhoXml(resultAho, false)
        : serialiseToPncUpdateDatasetXml(resultAho as PncUpdateDataset, false)
    const queueResult = await mqGateway.execute(generatedXml, destinationQueue)

    if (isError(queueResult)) {
      return queueResult
    }

    return resultAho
  } catch (err) {
    return isError(err)
      ? err
      : new Error(`Unspecified database error when resubmitting court case with ID: ${courtCaseId}`)
  }
}

export default resubmitCourtCase
