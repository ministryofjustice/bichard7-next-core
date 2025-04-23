import type { CaseAge } from "@moj-bichard7/common/types/CaseAge"
import type { DateRange } from "@moj-bichard7/common/types/DateRange"
import type postgres from "postgres"
import type { Row } from "postgres"

import { format } from "date-fns/format"
import { isEmpty } from "lodash"

import { CaseAgeOptions } from "../../../../../../useCases/cases/caseAgeOptions"

export const filterByCaseAge = (sql: postgres.Sql, caseAge?: CaseAge | CaseAge[]): postgres.PendingQuery<Row[]> => {
  if (!caseAge || isEmpty(caseAge)) {
    return sql``
  }

  const queries = [caseAge].flat().map((ca) => {
    const dateRange = CaseAgeOptions[ca]() satisfies DateRange

    return sql`el.court_date >= ${format(dateRange.from, "yyyy-MM-dd")} AND el.court_date <= ${format(dateRange.to, "yyyy-MM-dd")}`
  })

  const query = queries.map((q, i) => {
    if (queries.length > 1 && i !== queries.length - 1) {
      return sql`(${q}) OR`
    }

    if (queries.length !== 1 && i === queries.length - 1) {
      return sql`(${q})`
    }

    return sql`${q}`
  })

  return sql`AND (${query})`
}
