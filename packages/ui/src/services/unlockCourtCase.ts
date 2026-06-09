import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import type { DataSource, UpdateResult } from "typeorm"
import { isError } from "types/Result"
import type UnlockReason from "types/UnlockReason"
import type User from "./entities/User"
import getCourtCaseByOrganisationUnit from "./getCourtCaseByOrganisationUnit"
import { storeMessageAuditLogEvents } from "./storeAuditLogEvents"
import updateLockStatusToUnlocked from "./updateLockStatusToUnlocked"

const unlockCourtCase = async (
  dataSource: DataSource,
  courtCaseId: number,
  user: User,
  unlockReason: UnlockReason,
  usingApiResubmit?: boolean
): Promise<UpdateResult | Error | undefined> => {
  return await dataSource.transaction(async (entityManager) => {
    const events: AuditLogEvent[] = []

    const courtCase = await getCourtCaseByOrganisationUnit(entityManager, courtCaseId, user)

    if (isError(courtCase)) {
      throw courtCase
    }

    if (!courtCase) {
      throw new Error("Failed to unlock: Case not found")
    }

    const unlockResult = await updateLockStatusToUnlocked(
      entityManager,
      courtCase,
      user,
      unlockReason,
      events,
      usingApiResubmit
    )

    if (isError(unlockResult)) {
      throw unlockResult
    }

    await storeMessageAuditLogEvents(courtCase.messageId, events)

    return unlockResult
  })
}

export default unlockCourtCase
