import type { ExceptionReport, UserReportRow } from "@moj-bichard7/common/types/Reports"

import { processExceptions } from "./processExceptions"

export const processUsers = (userRows: UserReportRow[]): ExceptionReport[] => {
  return userRows.map((userRow) => {
    return {
      cases: userRow.cases.map(processExceptions),
      username: userRow.username
    }
  })
}
