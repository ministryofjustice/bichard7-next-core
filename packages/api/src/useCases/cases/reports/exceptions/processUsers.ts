import type { ExceptionReportDto } from "@moj-bichard7/common/types/reports/Exceptions"

import type { UserExceptionReportRow } from "../../../../types/reports/Exceptions"

import { processExceptions } from "./processExceptions"

export const processUsers = (userRows: UserExceptionReportRow[]): ExceptionReportDto[] => {
  return userRows.map((userRow) => {
    return {
      cases: userRow.cases.map(processExceptions),
      username: userRow.username
    }
  })
}
