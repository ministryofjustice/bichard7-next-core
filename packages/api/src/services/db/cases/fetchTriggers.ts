import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { Trigger, TriggerRow } from "@moj-bichard7/common/types/Trigger"
import type { User } from "@moj-bichard7/common/types/User"

import Permission from "@moj-bichard7/common/types/Permission"
import { isError } from "@moj-bichard7/common/types/Result"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import { isEmpty } from "lodash"

import type { Filters } from "../../../types/CaseIndexQuerystring"
import type { DatabaseConnection } from "../../../types/DatabaseGateway"

import mapTriggerRowToTrigger from "../mapTriggerRowToTrigger"
import { excludedTriggersAndStatusSql } from "./filters/excludedTriggersAndStatusSql"

export default async (
  database: DatabaseConnection,
  user: User,
  caseIds: number[],
  filters: Filters
): PromiseResult<Trigger[]> => {
  if (!userAccess(user)[Permission.Triggers]) {
    return []
  }

  let includeTriggersSql = database.connection``

  if (filters.reasonCodes && !isEmpty(filters.reasonCodes)) {
    const reasonCodes = Array.isArray(filters.reasonCodes) ? filters.reasonCodes : [filters.reasonCodes]
    const triggerCodes = reasonCodes.filter((rc) => rc.startsWith("TRP")) ?? []

    if (triggerCodes.length > 0) {
      includeTriggersSql = database.connection`AND elt.trigger_code = ANY (${triggerCodes})`
    }
  }

  const result = await database.connection<TriggerRow[]>`
    SELECT
      *
    FROM
      br7own.error_list_triggers elt
    WHERE
      elt.error_id = ANY (${caseIds})
      ${excludedTriggersAndStatusSql(database, user, filters)}
      ${includeTriggersSql}
  `.catch((error: Error) => error)

  if (isError(result)) {
    return Error(`Error while fetching triggers for case ids ${caseIds} and user ${user.username}: ${result.message}`)
  }

  return result.map(mapTriggerRowToTrigger)
}
