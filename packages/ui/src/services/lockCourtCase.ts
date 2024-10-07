import type { DataSource, UpdateResult } from "typeorm"
import type User from "./entities/User"
import updateLockStatusToLocked from "./updateLockStatusToLocked"
import type { AuditLogEvent } from "@moj-bichard7-developers/bichard7-next-core/common/types/AuditLogEvent"
import { isError } from "types/Result"
import { storeMessageAuditLogEvents } from "./storeAuditLogEvents"
import getCourtCaseByOrganisationUnit from "./getCourtCaseByOrganisationUnit"

const lockCourtCase = async (dataSource: DataSource, courtCaseId: number, user: User): Promise<UpdateResult | Error> =>
  dataSource.transaction("SERIALIZABLE", async (entityManager) => {
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
