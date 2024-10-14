import type { DataSource } from "typeorm"
import { Brackets } from "typeorm"
import type PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import { CaseAgeOptions } from "utils/caseAgeOptions"
import { formatFormInputDateString } from "utils/date/formattedDate"
import CourtCase from "./entities/CourtCase"
import type User from "./entities/User"
import courtCasesByOrganisationUnitQuery from "./queries/courtCasesByOrganisationUnitQuery"

const asKey = (caseAgeOption: string) => "_" + caseAgeOption.toLowerCase().replace(/ /g, "")

const getCountOfCasesByCaseAge = async (connection: DataSource, user: User): PromiseResult<Record<string, number>> => {
  const repository = connection.getRepository(CourtCase)
  let query = repository.createQueryBuilder()
  query = courtCasesByOrganisationUnitQuery(query, user)

  Object.keys(CaseAgeOptions).forEach((slaCaseAgeOption, i) => {
    const key = asKey(slaCaseAgeOption)
    const slaDateFrom = formatFormInputDateString(CaseAgeOptions[slaCaseAgeOption]().from)
    const slaDateTo = formatFormInputDateString(CaseAgeOptions[slaCaseAgeOption]().to)

    if (i === 0) {
      query.select(
        `Count(CASE WHEN court_date >= '${slaDateFrom}' AND court_date <= '${slaDateTo}' THEN 1 END) as ${key}`
      )
    } else {
      query.addSelect(
        `Count(CASE WHEN court_date >= '${slaDateFrom}' AND court_date <= '${slaDateTo}' THEN 1 END) as ${key}`
      )
    }
  })

  query.andWhere(
    new Brackets((qb) => {
      qb.where({
        errorStatus: "Unresolved"
      }).orWhere({ triggerStatus: "Unresolved" })
    })
  )

  const response = await query.getRawOne().catch((error: Error) => error)

  return isError(response)
    ? response
    : (Object.keys(CaseAgeOptions).reduce(
        (result: Record<string, number>, caseAge: string) => (
          (result[caseAge] = response ? response[asKey(caseAge)] : "0"), result
        ),
        {}
      ) as Record<string, number>)
}

export default getCountOfCasesByCaseAge
