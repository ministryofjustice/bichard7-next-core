import { Brackets, Like } from "typeorm"
import { DatabaseQuery } from "types/DatabaseQuery"
import CourtCase from "../entities/CourtCase"

const courtCasesByVisibleCourtsQuery = <T extends DatabaseQuery<CourtCase>>(query: T, courts: string[]): T => {
  query.orWhere(
    new Brackets((qb) => {
      if (courts.length < 1) {
        qb.where("FALSE") // prevent returning cases when there are no visible courts
        return
      }

      courts.forEach((code) => {
        const condition = { courtCode: Like(`${code}%`) }
        qb.orWhere(condition)
      })
    })
  )

  return query
}

export default courtCasesByVisibleCourtsQuery
