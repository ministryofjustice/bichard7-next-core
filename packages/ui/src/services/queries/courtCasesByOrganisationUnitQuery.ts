import User from "services/entities/User"
import { Brackets } from "typeorm"
import { DatabaseQuery } from "types/DatabaseQuery"
import CourtCase from "../entities/CourtCase"
import courtCasesByVisibleCourtsQuery from "./courtCasesByVisibleCourtsQuery"
import courtCasesByVisibleForcesQuery from "./courtCasesByVisibleForcesQuery"

const courtCasesByOrganisationUnitQuery = <T extends DatabaseQuery<CourtCase>>(query: T, user: User): T => {
  const { visibleForces, visibleCourts } = user
  query.where(
    new Brackets((qb) => {
      courtCasesByVisibleCourtsQuery(qb, visibleCourts)
      courtCasesByVisibleForcesQuery(qb, visibleForces)
    })
  )

  return query
}

export default courtCasesByOrganisationUnitQuery
