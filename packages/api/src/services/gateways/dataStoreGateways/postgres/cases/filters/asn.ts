import type postgres from "postgres"
import type { Row } from "postgres"

export const filterByAsn = (sql: postgres.Sql, asn?: string): postgres.PendingQuery<Row[]> => {
  if (asn === undefined) {
    return sql``
  }

  const asnWithoutSlashes = asn.replace(/\//g, "")

  return sql`AND el.asn ILIKE ${"%" + asnWithoutSlashes + "%"}`
}
