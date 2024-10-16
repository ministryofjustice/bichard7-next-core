import { Brackets } from "typeorm"
import type { DatabaseQuery } from "types/DatabaseQuery"
import type CourtCase from "../entities/CourtCase"

const courtCasesByVisibleForcesQuery = <T extends DatabaseQuery<CourtCase>>(query: T, forces: string[]): T => {
  const forceNumbers = forces.filter((f) => /^\d+$/.test(f)).map((f) => Number(f))

  query.orWhere(
    new Brackets((qb) => {
      if (forceNumbers.length < 1) {
        qb.where("FALSE") // prevent returning cases when there are no visible forces
        return
      }

      qb.where("br7own.force_code(org_for_police_filter) IN (:...forceNumbers)", { forceNumbers })
    })
  )

  return query
}

export default courtCasesByVisibleForcesQuery
