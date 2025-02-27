import type { Trigger } from "@moj-bichard7/common/types/Trigger"
import type postgres from "postgres"

export default async (sql: postgres.Sql, errorIds: number[]) => {
  // TODO: Add trigger filtering here
  const filtersSql = sql`
    -- AND elt.resolved_ts IS NULL
    -- AND elt.trigger_code = ANY (ARRAY['TRPS0010'])
  `

  const result: Trigger[] = await sql`
    SELECT
      *
    FROM
      br7own.error_list_triggers elt
    WHERE
      elt.error_id = ANY (${errorIds})
      ${filtersSql}
  `

  return result
}
