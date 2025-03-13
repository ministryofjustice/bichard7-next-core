import type postgres from "postgres"

import { isEmpty } from "lodash"

export const filterByPtiurn = (sql: postgres.Sql, ptiurn?: string) => {
  if (isEmpty(ptiurn?.replace(/\s/g, ""))) {
    return sql``
  }

  return sql`AND el.ptiurn ILIKE ${"%" + ptiurn + "%"}`
}
