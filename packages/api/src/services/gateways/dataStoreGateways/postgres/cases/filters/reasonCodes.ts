import type postgres from "postgres"

import type { Filters } from "../../../../../../types/CaseIndexQuerystring"

export const filterByReasonCodes = (sql: postgres.Sql, filters: Filters) => {
  if (filters.reasonCodes === undefined || filters.reasonCodes.length === 0) {
    return sql``
  }

  const triggerCodes = filters.reasonCodes?.filter((rc) => rc.startsWith("TRP")) ?? [""]
  const exceptionCodes = filters.reasonCodes?.filter((rc) => rc.startsWith("HO")).map((rc) => `%${rc}%`) ?? [""]

  return sql`
    AND (
      elt.trigger_code ILIKE ANY(${triggerCodes})
      OR el.error_report ILIKE ANY(${exceptionCodes})
    )
  `
}
