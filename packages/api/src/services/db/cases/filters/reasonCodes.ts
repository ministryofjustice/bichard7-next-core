import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"
import type { Row } from "postgres"

import { Reason } from "@moj-bichard7/common/types/ApiCaseQuery"
import Permission from "@moj-bichard7/common/types/Permission"
import {
  filterReasonCodesForExceptions,
  filterReasonCodesForTriggers
} from "@moj-bichard7/common/utils/filterReasonCodes"
import getLongTriggerCode from "@moj-bichard7/common/utils/getLongTriggerCode"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import { isEmpty } from "lodash"

import type { Filters } from "../../../../types/CaseIndexQuerystring"
import type { DatabaseConnection } from "../../../../types/DatabaseGateway"

export const filterByReasonCodes = (
  database: DatabaseConnection,
  filters: Filters,
  user: User
): postgres.PendingQuery<Row[]> => {
  if (filters.reasonCodes === undefined || isEmpty(filters.reasonCodes)) {
    return database.connection``
  }

  const queries: postgres.PendingQuery<Row[]>[] = []
  const reasonCodes = Array.isArray(filters.reasonCodes) ? filters.reasonCodes : [filters.reasonCodes]
  const triggerCodes = filterReasonCodesForTriggers(reasonCodes).map((rc) => getLongTriggerCode(rc)) ?? []
  const exceptionCodes = filterReasonCodesForExceptions(reasonCodes).map((rc) => `%${rc}%`) ?? []

  const reasonFilterOnlyIncludesTriggers = filters.reason === Reason.Triggers
  const reasonFilterOnlyIncludesExceptions = filters.reason === Reason.Exceptions

  const hasTriggersPermission = userAccess(user)[Permission.Triggers]
  const hasExceptionsPermission = userAccess(user)[Permission.Exceptions]

  if (!isEmpty(triggerCodes) && !reasonFilterOnlyIncludesExceptions && hasTriggersPermission) {
    queries.push(database.connection`elt.trigger_code ILIKE ANY(${triggerCodes})`)
  }

  if (!isEmpty(exceptionCodes) && !reasonFilterOnlyIncludesTriggers && hasExceptionsPermission) {
    queries.push(database.connection`el.error_report ILIKE ANY(${exceptionCodes})`)
  }

  if (queries.length === 0) {
    return database.connection``
  }

  const query = queries.map((q, i) => {
    if (queries.length === 2 && i === 0) {
      return database.connection`${q} OR`
    }

    return database.connection`${q}`
  })

  return database.connection`AND (${query})`
}
