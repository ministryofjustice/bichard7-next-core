import type postgres from "postgres"
import type { Row } from "postgres"

import {
  filterReasonCodesForExceptions,
  filterReasonCodesForTriggers
} from "@moj-bichard7/common/utils/filterReasonCodes"
import getLongTriggerCode from "@moj-bichard7/common/utils/getLongTriggerCode"
import { isEmpty } from "lodash"

import type { Filters } from "../../../../types/CaseIndexQuerystring"
import type { DatabaseConnection } from "../../../../types/DatabaseGateway"

export const filterByReasonCodes = (database: DatabaseConnection, filters: Filters): postgres.PendingQuery<Row[]> => {
  if (filters.reasonCodes === undefined || isEmpty(filters.reasonCodes)) {
    return database.connection``
  }

  const queries: postgres.PendingQuery<Row[]>[] = []
  const reasonCodes = Array.isArray(filters.reasonCodes) ? filters.reasonCodes : [filters.reasonCodes]
  const triggerCodes = filterReasonCodesForTriggers(reasonCodes).map((rc) => getLongTriggerCode(rc)) ?? []
  const exceptionCodes = filterReasonCodesForExceptions(reasonCodes).map((rc) => `%${rc}%`) ?? []

  if (!isEmpty(triggerCodes)) {
    queries.push(database.connection`elt.trigger_code ILIKE ANY(${triggerCodes})`)
  }

  if (!isEmpty(exceptionCodes)) {
    queries.push(database.connection`el.error_report ILIKE ANY(${exceptionCodes})`)
  }

  const query = queries.map((q, i) => {
    if (queries.length === 2 && i === 0) {
      return database.connection`${q} OR`
    }

    return database.connection`${q}`
  })

  return database.connection`AND (${query})`
}
