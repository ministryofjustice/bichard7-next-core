import type User from "services/entities/User"
import type { DataSource, EntityManager, UpdateResult } from "typeorm"
import type { RecordType } from "types/RecordType"
import type { ResolutionStatus } from "types/ResolutionStatus"
import type { UpdateResolutionStatus } from "types/UpdateResolutionStatus"

import CourtCase from "services/entities/CourtCase"
import { Brackets } from "typeorm"

const isErrorUpdate = (recordType: RecordType) => recordType === "Error"
const isResolved = (resolutionStatus: ResolutionStatus) => resolutionStatus === "Resolved"

const updateCourtCaseStatus = async (
  dataSource: DataSource | EntityManager,
  courtCase: CourtCase,
  recordType: RecordType,
  resolutionStatus: ResolutionStatus,
  { username }: User
): Promise<Error | UpdateResult> => {
  const timestamp = new Date()
  let updateResolutionStatus: UpdateResolutionStatus
  let updatedField: string
  const courtCaseRepository = dataSource.getRepository(CourtCase)

  if (isErrorUpdate(recordType)) {
    updateResolutionStatus = {
      errorResolvedBy: username,
      errorStatus: resolutionStatus,
      ...(isResolved(resolutionStatus) && { errorResolvedTimestamp: timestamp }),
      ...(((isResolved(resolutionStatus) && !courtCase?.triggerStatus) ||
        (courtCase && courtCase.triggerStatus && isResolved(courtCase.triggerStatus))) && {
        resolutionTimestamp: timestamp
      })
    }
    updatedField = "error"
  } else {
    updateResolutionStatus = {
      triggerResolvedBy: username,
      triggerStatus: resolutionStatus,
      ...(isResolved(resolutionStatus) && { triggerResolvedTimestamp: timestamp }),
      ...(((isResolved(resolutionStatus) && !courtCase?.errorStatus) ||
        (courtCase && courtCase.errorStatus && isResolved(courtCase.errorStatus))) && {
        resolutionTimestamp: timestamp
      })
    }
    updatedField = "trigger"
  }

  const query = courtCaseRepository
    .createQueryBuilder()
    .update(CourtCase)
    .set(updateResolutionStatus)
    .where("error_id = :id", { id: courtCase.errorId })
    .andWhere(`${updatedField}_status is NOT NULL`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`${updatedField}_locked_by_id = :user`, { user: username }).orWhere(
          `${updatedField}_locked_by_id is NULL`
        )
      })
    )

  return await query
    .returning("*")
    .execute()
    .catch((error: Error) => error)
}

export default updateCourtCaseStatus
