import type User from "services/entities/User"
import type { DatabaseQuery } from "types/DatabaseQuery"

import { Brackets } from "typeorm"

import type CourtCase from "../entities/CourtCase"

import courtCasesByVisibleCourtsQuery from "./courtCasesByVisibleCourtsQuery"
import courtCasesByVisibleForcesQuery from "./courtCasesByVisibleForcesQuery"

const courtCasesByOrganisationUnitQuery = <T extends DatabaseQuery<CourtCase>>(query: T, user: User): T => {
  const { visibleCourts, visibleForces } = user
  query.where(
    new Brackets((qb) => {
      courtCasesByVisibleCourtsQuery(qb, visibleCourts)
      courtCasesByVisibleForcesQuery(qb, visibleForces)
    })
  )

  return query
}

export default courtCasesByOrganisationUnitQuery
