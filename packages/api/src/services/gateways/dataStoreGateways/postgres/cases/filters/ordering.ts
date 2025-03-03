import type postgres from "postgres"

import { Order, OrderBy, type SortOrder } from "../../../../../../types/CaseIndexQuerystring"

export const ordering = (sql: postgres.Sql, sortOrder: SortOrder) => {
  const defaultPtiurn = sql`el_ptiurn ASC`
  const defaultOrder = sql`el_court_date DESC, ${defaultPtiurn}`

  let columnToOrder = `${sortOrder.orderBy}`

  if (sortOrder.order) {
    columnToOrder += ` ${sortOrder.order}`
  }

  switch (columnToOrder) {
    case `${OrderBy.courtDate} ${Order.asc}`:
      return sql`el_court_date ASC, ${defaultPtiurn}`
    case `${OrderBy.courtDate} ${Order.desc}`:
    case OrderBy.courtDate:
      return defaultOrder
    case `${OrderBy.courtName} ${Order.asc}`:
    case OrderBy.courtName:
      return sql`el_court_name ASC, ${defaultOrder}`
    case `${OrderBy.courtName} ${Order.desc}`:
      return sql`el_court_name DESC, ${defaultOrder}`
    case `${OrderBy.defendantName} ${Order.asc}`:
      return sql`el_defendant_name ASC, ${defaultOrder}`
    case `${OrderBy.defendantName} ${Order.desc}`:
      return sql`el_defendant_name DESC, ${defaultOrder}`
    default:
      return defaultOrder
  }
}
