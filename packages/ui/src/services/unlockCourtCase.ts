import type { DataSource, UpdateResult } from "typeorm"
import { isError } from "types/Result"
import type User from "./entities/User"
import updateLockStatusToUnlocked from "./updateLockStatusToUnlocked"
import type { AuditLogEvent } from "@moj-bichard7-developers/bichard7-next-core/common/types/AuditLogEvent"
import { storeMessageAuditLogEvents } from "./storeAuditLogEvents"
import type UnlockReason from "types/UnlockReason"
import getCourtCaseByOrganisationUnit from "./getCourtCaseByOrganisationUnit"

const unlockCourtCase = async (
  dataSource: DataSource,
  courtCaseId: number,
  user: User,
  unlockReason: UnlockReason
): Promise<UpdateResult | Error> => {
  const updateResult = await dataSource.transaction("SERIALIZABLE", async (entityManager) => {
    const events: AuditLogEvent[] = []

    const courtCase = await getCourtCaseByOrganisationUnit(entityManager, courtCaseId, user)

    if (isError(courtCase)) {
      throw courtCase
    }

    if (!courtCase) {
      throw new Error("Failed to unlock: Case not found")
    }

    const unlockResult = await updateLockStatusToUnlocked(entityManager, courtCase, user, unlockReason, events)

    if (isError(unlockResult)) {
      throw unlockResult
    }

    const storeAuditLogResponse = await storeMessageAuditLogEvents(courtCase.messageId, events)

    if (isError(storeAuditLogResponse)) {
      throw storeAuditLogResponse
    }

    return unlockResult
  })

  return updateResult
}

export default unlockCourtCase
