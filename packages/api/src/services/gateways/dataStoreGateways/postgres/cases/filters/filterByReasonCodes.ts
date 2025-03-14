import type postgres from "postgres"
import type { Row } from "postgres"

import { isEmpty } from "lodash"

import type { Filters } from "../../../../../../types/CaseIndexQuerystring"

export const filterByReasonCodes = (sql: postgres.Sql, filters: Filters): postgres.PendingQuery<Row[]> => {
  if (filters.reasonCodes === undefined || isEmpty(filters.reasonCodes)) {
    return sql``
  }

  const queries = []
  const reasonCodes = Array.isArray(filters.reasonCodes) ? filters.reasonCodes : [filters.reasonCodes]
  const triggerCodes = reasonCodes.filter((rc) => rc.startsWith("TRP")) ?? []
  const exceptionCodes = reasonCodes.filter((rc) => rc.startsWith("HO")).map((rc) => `%${rc}%`) ?? []

  if (!isEmpty(triggerCodes)) {
    queries.push(sql`elt.trigger_code ILIKE ANY(${triggerCodes})`)
  }

  if (!isEmpty(exceptionCodes)) {
    queries.push(sql`el.error_report ILIKE ANY(${exceptionCodes})`)
  }

  const query = queries.map((q, i) => {
    if (queries.length === 2 && i === 0) {
      return sql`${q} OR`
    }

    return sql`${q}`
  })

  return sql`AND (${query})`
}
