import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import { Brackets, DataSource, EntityManager, UpdateResult } from "typeorm"
import { RecordType } from "types/RecordType"
import { ResolutionStatus } from "types/ResolutionStatus"
import { UpdateResolutionStatus } from "types/UpdateResolutionStatus"

const isErrorUpdate = (recordType: RecordType) => recordType === "Error"
const isResolved = (resolutionStatus: ResolutionStatus) => resolutionStatus === "Resolved"

const updateCourtCaseStatus = async (
  dataSource: DataSource | EntityManager,
  courtCase: CourtCase,
  recordType: RecordType,
  resolutionStatus: ResolutionStatus,
  { username }: User
): Promise<UpdateResult | Error> => {
  const timestamp = new Date()
  let updateResolutionStatus: UpdateResolutionStatus
  let updatedField: string
  const courtCaseRepository = dataSource.getRepository(CourtCase)

  if (isErrorUpdate(recordType)) {
    updateResolutionStatus = {
      errorStatus: resolutionStatus,
      errorResolvedBy: username,
      ...(isResolved(resolutionStatus) && { errorResolvedTimestamp: timestamp }),
      ...(((isResolved(resolutionStatus) && !courtCase?.triggerStatus) ||
        (courtCase && courtCase.triggerStatus && isResolved(courtCase.triggerStatus))) && {
        resolutionTimestamp: timestamp
      })
    }
    updatedField = "error"
  } else {
    updateResolutionStatus = {
      triggerStatus: resolutionStatus,
      triggerResolvedBy: username,
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

  return query
    .returning("*")
    .execute()
    .catch((error: Error) => error)
}

export default updateCourtCaseStatus
