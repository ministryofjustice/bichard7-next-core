import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import type { DataSource, UpdateResult } from "typeorm"
import { isError } from "types/Result"
import type User from "./entities/User"
import getCourtCaseByOrganisationUnit from "./getCourtCaseByOrganisationUnit"
import { storeMessageAuditLogEvents } from "./storeAuditLogEvents"
import updateLockStatusToLocked from "./updateLockStatusToLocked"
import { lockCourtCaseRow } from "./lockCourtCaseRow"

const lockCourtCase = async (
  dataSource: DataSource,
  courtCaseId: number,
  user: User
): Promise<UpdateResult | Error> => {
  return await dataSource.transaction(async (entityManager) => {
    const courtCase = await getCourtCaseByOrganisationUnit(entityManager, courtCaseId, user)

    if (!courtCase) {
      throw new Error("Failed to lock: Case not found")
    }

    if (isError(courtCase)) {
      throw new Error(`Failed to lock: ${courtCase.message}`)
    }

    await lockCourtCaseRow(entityManager, courtCaseId)
    const events: AuditLogEvent[] = []
    const lockResult = await updateLockStatusToLocked(entityManager, courtCaseId, user, events)

    if (isError(lockResult)) {
      throw lockResult
    }

    await storeMessageAuditLogEvents(courtCase.messageId, events)

    return lockResult
  })
}

export default lockCourtCase
