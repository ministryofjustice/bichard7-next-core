import type postgres from "postgres"

import { isEmpty } from "lodash"

import type { Filters } from "../../../../../../types/CaseIndexQuerystring"

export const filterByReasonCodes = (sql: postgres.Sql, filters: Filters) => {
  if (filters.reasonCodes === undefined || filters.reasonCodes.length === 0) {
    return sql``
  }

  const queries = []

  const triggerCodes = filters.reasonCodes?.filter((rc) => rc.startsWith("TRP")) ?? [""]
  const exceptionCodes = filters.reasonCodes?.filter((rc) => rc.startsWith("HO")).map((rc) => `%${rc}%`) ?? [""]

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
