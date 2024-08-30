import { AuditLogEvent } from "@moj-bichard7-developers/bichard7-next-core/common/types/AuditLogEvent"
import { DataSource, EntityManager, UpdateResult } from "typeorm"
import { ManualResolution } from "types/ManualResolution"
import { isError } from "types/Result"
import UnlockReason from "types/UnlockReason"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"
import insertNotes from "./insertNotes"
import resolveError from "./resolveError"
import { storeMessageAuditLogEvents } from "./storeAuditLogEvents"
import updateLockStatusToUnlocked from "./updateLockStatusToUnlocked"

const resolveCourtCase = async (
  dataSource: DataSource | EntityManager,
  courtCase: CourtCase,
  resolution: ManualResolution,
  user: User
): Promise<UpdateResult | Error> => {
  return dataSource.transaction("SERIALIZABLE", async (entityManager) => {
    const events: AuditLogEvent[] = []

    // resolve case
    const resolveErrorResult = await resolveError(entityManager, courtCase, user, resolution, events)
    if (isError(resolveErrorResult)) {
      throw resolveErrorResult
    }

    // unlock case
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

    // add manual resolution case note
    const addNoteResult = await insertNotes(entityManager, [
      {
        noteText:
          `${user.username}: Portal Action: Record Manually Resolved.` +
          ` Reason: ${resolution.reason}. Reason Text: ${resolution.reasonText}`,
        errorId: courtCase.errorId,
        userId: "System"
      }
    ])
    if (isError(addNoteResult)) {
      throw addNoteResult
    }

    // push audit log events
    const storeAuditLogResponse = await storeMessageAuditLogEvents(courtCase.messageId, events)
    if (isError(storeAuditLogResponse)) {
      throw storeAuditLogResponse
    }

    return resolveErrorResult
  })
}

export default resolveCourtCase
