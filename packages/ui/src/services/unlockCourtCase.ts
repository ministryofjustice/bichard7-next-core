import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import type { DataSource, UpdateResult } from "typeorm"
import { isError } from "types/Result"
import type UnlockReason from "types/UnlockReason"
import type User from "./entities/User"
import getCourtCaseByOrganisationUnit from "./getCourtCaseByOrganisationUnit"
import { retryTransaction } from "./retryTransaction"
import { storeMessageAuditLogEvents } from "./storeAuditLogEvents"
import updateLockStatusToUnlocked from "./updateLockStatusToUnlocked"

const unlockCourtCaseTransaction = async (
  dataSource: DataSource,
  courtCaseId: number,
  user: User,
  unlockReason: UnlockReason
) => {
  return await dataSource.transaction("SERIALIZABLE", async (entityManager) => {
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
}

const unlockCourtCase = async (
  dataSource: DataSource,
  courtCaseId: number,
  user: User,
  unlockReason: UnlockReason
): Promise<UpdateResult | Error | undefined> => {
  return await retryTransaction(unlockCourtCaseTransaction, dataSource, courtCaseId, user, unlockReason)
}

export default unlockCourtCase
