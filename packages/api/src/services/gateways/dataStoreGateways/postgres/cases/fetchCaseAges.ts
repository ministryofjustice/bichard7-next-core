import type { CaseAges } from "@moj-bichard7/common/types/Case"
import type postgres from "postgres"
import type { Row } from "postgres"

import { CaseAge } from "@moj-bichard7/common/types/CaseAge"
import { format, isValid } from "date-fns"

import { CaseAgeOptions } from "../../../../../useCases/cases/caseAgeOptions"
import { ResolutionStatusNumber } from "../../../../../useCases/dto/convertResolutionStatus"

const formInputDateFormat = "yyyy-MM-dd"
const formatFormInputDateString = (date: Date): string => (isValid(date) ? format(date, formInputDateFormat) : "")

export const fetchCaseAges = async (
  sql: postgres.Sql,
  organisationUnitSql: postgres.PendingQuery<Row[]>
): Promise<CaseAges> => {
  const queries: postgres.PendingQuery<postgres.Row[]>[] = []
  const resolutionStats = ResolutionStatusNumber.Unresolved
  const slaCaseAges = Object.values(CaseAge)

  slaCaseAges.forEach((key, i) => {
    const slaDateFrom = formatFormInputDateString(CaseAgeOptions[key]().from)
    const slaDateTo = formatFormInputDateString(CaseAgeOptions[key]().to)

    const countSql = sql`
      COUNT (CASE WHEN court_date >= ${slaDateFrom} AND court_date <= ${slaDateTo} THEN 1 END) AS ${sql([key])}
    `

    if (i + 1 === slaCaseAges.length) {
      queries.push(countSql)
    } else {
      queries.push(sql`${countSql},`)
    }
  })

  if (queries.length === 0) {
    throw Error("Generated no CaseAges queries")
  }

  const query = queries.map((q) => sql`${q}`)

  const [caseAges]: [CaseAges?] = await sql`
    SELECT
      ${query}
    FROM br7own.error_list el
    WHERE
      ${organisationUnitSql}
      AND (el.error_status = ${resolutionStats} OR el.trigger_status = ${resolutionStats})
      AND (el.trigger_status = ${resolutionStats} OR el.error_status = ${resolutionStats})
  `

  if (!caseAges) {
    throw Error("Found no CaseAges")
  }

  return caseAges
}
