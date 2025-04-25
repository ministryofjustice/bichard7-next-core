import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import type { DataSource, UpdateResult } from "typeorm"
import { isError } from "types/Result"
import type User from "./entities/User"
import getCourtCaseByOrganisationUnit from "./getCourtCaseByOrganisationUnit"
import { retryTransaction } from "./retryTransaction"
import { storeMessageAuditLogEvents } from "./storeAuditLogEvents"
import updateLockStatusToLocked from "./updateLockStatusToLocked"

const lockCourtCaseTransaction = async (dataSource: DataSource, courtCaseId: number, user: User) => {
  return await dataSource.transaction("SERIALIZABLE", async (entityManager) => {
    const courtCase = await getCourtCaseByOrganisationUnit(entityManager, courtCaseId, user)

    if (!courtCase) {
      throw new Error("Failed to unlock: Case not found")
    }

    if (isError(courtCase)) {
      throw new Error(`Failed to unlock: ${courtCase.message}`)
    }

    const events: AuditLogEvent[] = []
    const lockResult = await updateLockStatusToLocked(entityManager, courtCaseId, user, events)

    if (isError(lockResult)) {
      throw lockResult
    }

    const storeAuditLogResponse = await storeMessageAuditLogEvents(courtCase.messageId, events)

    if (isError(storeAuditLogResponse)) {
      throw storeAuditLogResponse
    }

    return lockResult
  })
}

const lockCourtCase = async (dataSource: DataSource, courtCaseId: number, user: User): Promise<UpdateResult | Error> =>
  await retryTransaction(lockCourtCaseTransaction, dataSource, courtCaseId, user)

export default lockCourtCase
