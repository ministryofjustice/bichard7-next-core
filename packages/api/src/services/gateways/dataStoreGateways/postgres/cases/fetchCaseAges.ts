import type { CaseAges } from "@moj-bichard7/common/types/Case"
import type postgres from "postgres"
import type { Row } from "postgres"

import { CaseAge } from "@moj-bichard7/common/types/CaseAge"
import { format, isValid } from "date-fns"
import { isEmpty } from "lodash"

import { CaseAgeOptions } from "../../../../../useCases/cases/caseAgeOptions"
import { ResolutionStatusNumber } from "../../../../../useCases/dto/convertResolutionStatus"

const formInputDateFormat = "yyyy-MM-dd"
const formatFormInputDateString = (date: Date): string => (isValid(date) ? format(date, formInputDateFormat) : "")

export const fetchCaseAges = async (
  sql: postgres.Sql,
  organisationUnitSql: postgres.PendingQuery<Row[]>,
  excludedTriggers: null | string
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

  let excludedTriggersSql: postgres.PendingQuery<postgres.Row[]> = sql``

  if (excludedTriggers && !isEmpty(excludedTriggers)) {
    const excludedTriggersArray = excludedTriggers.split(",")

    if (excludedTriggersArray.length > 0) {
      excludedTriggersSql = sql`AND NOT elt.trigger_code = ANY (${excludedTriggersArray})`
    }
  }

  const query = queries.map((q) => sql`${q}`)

  const [caseAges]: [CaseAges?] = await sql`
    SELECT
      ${query}
    FROM br7own.error_list el
    LEFT JOIN br7own.error_list_triggers elt ON elt.error_id = el.error_id
    WHERE
      ${organisationUnitSql}
      AND (el.error_status = ${resolutionStats} OR el.trigger_status = ${resolutionStats})
      AND (el.trigger_status = ${resolutionStats} OR el.error_status = ${resolutionStats})
      ${excludedTriggersSql}
  `

  if (!caseAges) {
    throw Error("Found no CaseAges")
  }

  return caseAges
}
