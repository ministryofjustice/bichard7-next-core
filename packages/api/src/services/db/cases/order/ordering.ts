import type postgres from "postgres"
import type { Row } from "postgres"

import { Order, OrderBy } from "@moj-bichard7/common/types/ApiCaseQuery"

import type { SortOrder } from "../../../../types/CaseIndexQuerystring"

export const ordering = (sql: postgres.Sql, sortOrder: SortOrder): postgres.PendingQuery<Row[]> => {
  const defaultCourtDate = sql`el_court_date DESC`
  const defaultPtiurn = sql`el_ptiurn ASC`
  const defaultOrder = sql`${defaultCourtDate}, ${defaultPtiurn}`

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
    case `${OrderBy.messageReceivedTimestamp} ${Order.asc}`:
      return sql`el_msg_received_ts ASC, ${defaultOrder}`
    case `${OrderBy.messageReceivedTimestamp} ${Order.desc}`:
      return sql`el_msg_received_ts DESC, ${defaultOrder}`
    case `${OrderBy.ptiurn} ${Order.desc}`:
      return sql`${defaultCourtDate}, el_ptiurn DESC`
    default:
      return defaultOrder
  }
}
