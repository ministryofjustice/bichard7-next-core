import type { ExceptionReportDto } from "@moj-bichard7/common/types/reports/Exceptions"

import type { UserExceptionReportRow } from "../../../../types/reports/Exceptions"

import { CASE_TYPES } from "../../../../types/reports/Exceptions"
import { processExceptions } from "./processExceptions"

export const processUsers = (userRows: UserExceptionReportRow[]): ExceptionReportDto[] => {
  return userRows.map((userRow) => {
    const processedCases = []
    let exceptions = 0
    let triggers = 0

    for (const c of userRow.cases) {
      if (c.type === CASE_TYPES.Exception) {
        exceptions++
      } else if (c.type === CASE_TYPES.Trigger) {
        triggers++
      }

      processedCases.push(processExceptions(c))
    }

    return {
      cases: processedCases,
      totals: {
        exceptions,
        total: userRow.cases.length,
        triggers
      },
      username: userRow.full_name || userRow.username
    }
  })
}
