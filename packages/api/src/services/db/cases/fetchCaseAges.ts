import type { CaseAges } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"

import { CaseAge } from "@moj-bichard7/common/types/CaseAge"
import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"
import { format, isValid } from "date-fns"

import type { DatabaseConnection } from "../../../types/DatabaseGateway"

import { NotFoundError } from "../../../types/errors/NotFoundError"
import { CaseAgeOptions } from "../../../useCases/cases/getCase/caseAgeOptions"
import { ResolutionStatusNumber } from "../../../useCases/dto/convertResolutionStatus"
import { organisationUnitSql } from "../organisationUnitSql"

const formInputDateFormat = "yyyy-MM-dd"
const formatFormInputDateString = (date: Date): string => (isValid(date) ? format(date, formInputDateFormat) : "")

export const fetchCaseAges = async (database: DatabaseConnection, user: User): PromiseResult<CaseAges> => {
  const slaCaseAges = Object.values(CaseAge)

  const queries = slaCaseAges.reduce((queries: postgres.PendingQuery<postgres.Row[]>[], key, index) => {
    const slaDateFrom = formatFormInputDateString(CaseAgeOptions[key]().from)
    const slaDateTo = formatFormInputDateString(CaseAgeOptions[key]().to)

    const countSql = database.connection`
      COUNT (DISTINCT CASE WHEN el.court_date >= ${slaDateFrom} AND el.court_date <= ${slaDateTo} THEN el.error_id END) AS ${database.connection([key])}
    `
    queries.push(index + 1 === slaCaseAges.length ? countSql : database.connection`${countSql},`)

    return queries
  }, [])

  if (queries.length === 0) {
    return Error("Generated no CaseAges queries")
  }

  const excludedTriggersSql =
    user.excludedTriggers.length > 0
      ? database.connection`AND NOT elt.trigger_code = ANY (${user.excludedTriggers})`
      : database.connection``

  const query = queries.map((q) => database.connection`${q}`)

  const caseAges = await database.connection<CaseAges[]>`
    SELECT
      ${query}
    FROM br7own.error_list el
    LEFT JOIN br7own.error_list_triggers elt ON elt.error_id = el.error_id
    WHERE
      (${organisationUnitSql(database, user)})
      AND (el.error_status = ${ResolutionStatusNumber.Unresolved} OR el.trigger_status = ${ResolutionStatusNumber.Unresolved})
      ${excludedTriggersSql}
  `.catch((error: Error) => error)

  if (isError(caseAges)) {
    return Error(`Error while fetching the case ages: ${caseAges.message}`)
  }

  if (!caseAges) {
    return new NotFoundError("Found no case ages")
  }

  return caseAges[0]
}
