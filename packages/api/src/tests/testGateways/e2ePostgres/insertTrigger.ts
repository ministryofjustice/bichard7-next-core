import type { Trigger } from "@moj-bichard7/common/types/Trigger"
import type postgres from "postgres"

import { sortStringAsc } from "../../helpers/sort"

export default async function (sql: postgres.Sql, partialTrigger: Partial<Trigger>): Promise<Trigger> {
  if (!(partialTrigger.error_id || partialTrigger.trigger_code)) {
    throw new Error("Missing required attributes")
  }

  const triggerColumns = sortStringAsc(Object.keys(partialTrigger))

  const [result]: [Trigger?] = await sql`
    INSERT INTO br7own.error_list_triggers
      ${sql(partialTrigger as never, triggerColumns)}
    RETURNING *;
  `

  if (!result) {
    throw new Error("Could not insert Case into the DB")
  }

  return result
}
