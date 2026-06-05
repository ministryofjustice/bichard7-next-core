import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import type { DataSource, EntityManager, UpdateResult } from "typeorm"
import type { ManualResolution } from "types/ManualResolution"
import { isError } from "types/Result"
import UnlockReason from "types/UnlockReason"
import type CourtCase from "./entities/CourtCase"
import type User from "./entities/User"
import insertNotes from "./insertNotes"
import resolveError from "./resolveError"
import { storeMessageAuditLogEvents } from "./storeAuditLogEvents"
import updateLockStatusToUnlocked from "./updateLockStatusToUnlocked"
import getCourtCaseByOrganisationUnit from "./getCourtCaseByOrganisationUnit" // NEW: Import this

const resolveCourtCase = async (
  dataSource: DataSource | EntityManager,
  courtCase: CourtCase,
  resolution: ManualResolution,
  user: User
): Promise<UpdateResult | Error> => {
  return await dataSource.transaction(async (entityManager) => {
    const events: AuditLogEvent[] = []

    const fetchCourtCase = await getCourtCaseByOrganisationUnit(entityManager, courtCase.errorId, user)

    if (isError(fetchCourtCase)) {
      throw fetchCourtCase
    }

    if (!fetchCourtCase) {
      throw new Error("Failed to resolve: Case not found")
    }

    // resolve case
    const resolveErrorResult = await resolveError(entityManager, fetchCourtCase, user, resolution, events)
    if (isError(resolveErrorResult)) {
      throw resolveErrorResult
    }

    // unlock case
    const unlockResult = await updateLockStatusToUnlocked(
      entityManager,
      fetchCourtCase,
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

    await storeMessageAuditLogEvents(fetchCourtCase.messageId, events)

    return resolveErrorResult
  })
}

export default resolveCourtCase
