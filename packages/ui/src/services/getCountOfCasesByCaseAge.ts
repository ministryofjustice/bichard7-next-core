import type { DataSource } from "typeorm"
import { Brackets } from "typeorm"
import type PromiseResult from "types/PromiseResult"
import { CaseAgeOptions } from "utils/caseAgeOptions"
import { formatFormInputDateString } from "utils/date/formattedDate"
import CourtCase from "./entities/CourtCase"
import type User from "./entities/User"
import courtCasesByOrganisationUnitQuery from "./queries/courtCasesByOrganisationUnitQuery"

const getCountOfCasesByCaseAge = async (connection: DataSource, user: User): PromiseResult<Record<string, number>> => {
  const repository = connection.getRepository(CourtCase)
  let query = repository.createQueryBuilder()
  query = courtCasesByOrganisationUnitQuery(query, user)

  Object.keys(CaseAgeOptions).forEach((slaCaseAgeOption, i) => {
    const key = slaCaseAgeOption
    const slaDateFrom = formatFormInputDateString(CaseAgeOptions[slaCaseAgeOption]().from)
    const slaDateTo = formatFormInputDateString(CaseAgeOptions[slaCaseAgeOption]().to)

    const count = `Count(CASE WHEN court_date >= '${slaDateFrom}' AND court_date <= '${slaDateTo}' THEN 1 END) as "${key}"`

    if (i === 0) {
      query.select(count)
    } else {
      query.addSelect(count)
    }
  })

  query.andWhere(
    new Brackets((qb) => {
      qb.where({
        errorStatus: "Unresolved"
      }).orWhere({ triggerStatus: "Unresolved" })
    })
  )

  return await query.getRawOne().catch((error: Error) => error)
}

export default getCountOfCasesByCaseAge
