import type { Trigger } from "@moj-bichard7/common/types/Trigger"
import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"

import Permission from "@moj-bichard7/common/types/Permission"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import { isEmpty } from "lodash"

import type { Filters } from "../../../../../types/CaseIndexQuerystring"

import { excludedTriggersAndStatusSql } from "./filters/excludedTriggersAndStatusSql"

export default async (sql: postgres.Sql, errorIds: number[], filters: Filters, user: User) => {
  if (!userAccess(user)[Permission.Triggers]) {
    return []
  }

  if (filters.reasonCodes === undefined || isEmpty(filters.reasonCodes)) {
    return []
  }

  const reasonCodes = Array.isArray(filters.reasonCodes) ? filters.reasonCodes : [filters.reasonCodes]
  const triggerCodes = reasonCodes.filter((rc) => rc.startsWith("TRP")) ?? []

  let includeTriggersSql = sql``

  if (triggerCodes.length > 0) {
    includeTriggersSql = sql`AND elt.trigger_code = ANY (${triggerCodes})`
  }

  const result: Trigger[] = await sql`
    SELECT
      *
    FROM
      br7own.error_list_triggers elt
    WHERE
      elt.error_id = ANY (${errorIds})
      ${excludedTriggersAndStatusSql(sql, filters, user)}
      ${includeTriggersSql}
  `

  return result
}
