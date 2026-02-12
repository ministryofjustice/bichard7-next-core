import type { ExceptionReport, UserExceptionReportRow } from "@moj-bichard7/common/types/reports/ExceptionReport"

import { processExceptions } from "./processExceptions"

export const processUsers = (userRows: UserExceptionReportRow[]): ExceptionReport[] => {
  return userRows.map((userRow) => {
    return {
      cases: userRow.cases.map(processExceptions),
      username: userRow.username
    }
  })
}
