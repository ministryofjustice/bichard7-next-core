import { AuditLogEvent } from "@moj-bichard7-developers/bichard7-next-core/common/types/AuditLogEvent"
import serialiseToXml from "@moj-bichard7-developers/bichard7-next-core/core/lib/serialise/ahoXml/serialiseToXml"
import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import amendCourtCase from "services/amendCourtCase"
import User from "services/entities/User"
import insertNotes from "services/insertNotes"
import sendToQueue from "services/mq/sendToQueue"
import updateCourtCaseStatus from "services/updateCourtCaseStatus"
import updateLockStatusToLocked from "services/updateLockStatusToLocked"
import updateLockStatusToUnlocked from "services/updateLockStatusToUnlocked"
import { DataSource } from "typeorm"
import type { Amendments } from "types/Amendments"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import UnlockReason from "types/UnlockReason"
import getCourtCaseByOrganisationUnit from "./getCourtCaseByOrganisationUnit"

const phase1ResubmissionQueue = process.env.PHASE_1_RESUBMIT_QUEUE_NAME ?? "PHASE_1_RESUBMIT_QUEUE"

const resubmitCourtCase = async (
  dataSource: DataSource,
  form: Partial<Amendments>,
  courtCaseId: number,
  user: User
): PromiseResult<AnnotatedHearingOutcome | Error> => {
  try {
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
          [] //TODO pass an actual audit log events array
        )

        if (isError(unlockResult)) {
          throw unlockResult
        }

        return amendedCourtCase
      }
    )

    if (isError(resultAho)) {
      throw resultAho
    }

    // TODO: this doesn't look right - should it be in transaction??
    const generatedXml = serialiseToXml(resultAho, false)
    const queueResult = await sendToQueue({ messageXml: generatedXml, queueName: phase1ResubmissionQueue })

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
