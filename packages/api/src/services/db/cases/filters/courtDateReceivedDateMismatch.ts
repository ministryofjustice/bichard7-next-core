import type postgres from "postgres"
import type { Row } from "postgres"

import type { DatabaseConnection } from "../../../../types/DatabaseGateway"

export const filterByCourtDateReceivedDateMismatch = (
  database: DatabaseConnection,
  courtDateReceivedDateMismatch: boolean | undefined
): postgres.PendingQuery<Row[]> => {
  if (!courtDateReceivedDateMismatch) {
    return database.connection``
  }

  return database.connection`AND el.court_date <> el.msg_received_ts::date`
}
