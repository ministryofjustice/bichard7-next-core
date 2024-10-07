import { DataSource, EntityManager } from "typeorm"
import CourtCase from "./entities/CourtCase"
import PromiseResult from "../types/PromiseResult"
import courtCasesByOrganisationUnitQuery from "./queries/courtCasesByOrganisationUnitQuery"
import User from "./entities/User"
import leftJoinAndSelectTriggersQuery from "./queries/leftJoinAndSelectTriggersQuery"

const getCourtCaseByOrganisationUnit = (
  dataSource: DataSource | EntityManager,
  courtCaseId: number,
  user: User,
  loadLockUsers?: boolean
): PromiseResult<CourtCase | null> => {
  const courtCaseRepository = dataSource.getRepository(CourtCase)
  let query = courtCaseRepository.createQueryBuilder("courtCase")
  query = courtCasesByOrganisationUnitQuery(query, user).andWhere({ errorId: courtCaseId })

  if (loadLockUsers) {
    query
      .leftJoin("courtCase.errorLockedByUser", "errorLockedByUser")
      .addSelect(["errorLockedByUser.forenames", "errorLockedByUser.surname"])
      .leftJoin("courtCase.triggerLockedByUser", "triggerLockedByUser")
      .addSelect(["triggerLockedByUser.forenames", "triggerLockedByUser.surname"])
  }

  leftJoinAndSelectTriggersQuery(query, user.excludedTriggers)
    .leftJoinAndSelect("courtCase.notes", "note")
    .leftJoin("note.user", "user")
    .addSelect(["user.forenames", "user.surname", "user.visibleForces", "user.username"])
    .addOrderBy("note.createdAt", "ASC")

  return query.getOne().catch((error) => error)
}

export default getCourtCaseByOrganisationUnit
