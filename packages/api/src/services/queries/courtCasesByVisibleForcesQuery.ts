import type CourtCase from "src/services/entities/CourtCase"
import type { SelectQueryBuilder, UpdateQueryBuilder } from "typeorm"
import { Brackets, In, Like } from "typeorm"

const courtCasesByVisibleForcesQuery = (
  query: SelectQueryBuilder<CourtCase> | UpdateQueryBuilder<CourtCase>,
  forces: string[]
): SelectQueryBuilder<CourtCase> | UpdateQueryBuilder<CourtCase> => {
  query.where(
    new Brackets((qb) => {
      if (forces.length < 1) {
        qb.where(":numForces > 0", { numForces: forces.length })
        return query
      }

      forces.forEach((force) => {
        if (force.length === 1) {
          const condition = { orgForPoliceFilter: Like(`${force}__%`) }
          qb.where(condition)
        } else {
          const condition = { orgForPoliceFilter: Like(`${force}%`) }
          qb.orWhere(condition)
        }

        if (force.length > 3) {
          const subCodes = Array.from([...force].keys())
            .splice(4)
            .map((index) => force.substring(0, index))
          qb.orWhere({ orgForPoliceFilter: In(subCodes) })
        }
      })
    })
  )

  return query
}

export default courtCasesByVisibleForcesQuery
