import type { AuditLogEvent } from "@moj-bichard7-developers/bichard7-next-core/common/types/AuditLogEvent"
import type { DataSource, UpdateResult } from "typeorm"
import { isError } from "types/Result"
import type User from "./entities/User"
import getCourtCaseByOrganisationUnit from "./getCourtCaseByOrganisationUnit"
import { storeMessageAuditLogEvents } from "./storeAuditLogEvents"
import updateLockStatusToLocked from "./updateLockStatusToLocked"

const lockCourtCase = async (dataSource: DataSource, courtCaseId: number, user: User): Promise<UpdateResult | Error> =>
  await dataSource.transaction("SERIALIZABLE", async (entityManager) => {
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

export default lockCourtCase
