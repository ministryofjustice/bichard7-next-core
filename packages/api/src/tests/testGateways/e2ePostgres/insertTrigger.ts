import type { TriggerRow } from "@moj-bichard7/common/types/Trigger"
import type postgres from "postgres"

import { isError } from "@moj-bichard7/common/types/Result"

import { sortStringAsc } from "../../helpers/sort"

export default async function (sql: postgres.Sql, triggerRow: TriggerRow): Promise<TriggerRow> {
  if (!(triggerRow.error_id || triggerRow.trigger_code)) {
    throw new Error("Missing required attributes")
  }

  const triggerColumns = sortStringAsc(Object.keys(triggerRow))

  const result = await sql<TriggerRow[]>`
    INSERT INTO br7own.error_list_triggers
      ${sql(triggerRow as never, triggerColumns)}
    RETURNING *;
  `

  if (!result || isError(result)) {
    throw new Error("Could not insert Case into the DB")
  }

  return result[0]
}
