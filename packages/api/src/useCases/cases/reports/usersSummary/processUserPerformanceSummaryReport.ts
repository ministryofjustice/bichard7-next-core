import type {
  UserForPerformanceSummaryDto,
  UserPerformanceSummaryDto
} from "@moj-bichard7/common/types/reports/UserPerformanceSummary"

import { endOfDay, isBefore, startOfDay, subDays } from "date-fns"

import type { UserSummaryRow } from "../../../../types/reports/UserSummary"

import { convertRowToUserForPerformanceSummaryDto } from "../../../dto/reports/convertRowToUserForPerformanceSummaryDto"
import { formatDate } from "../utils/formatDate"

const emptyTotals = () => ({
  exceptionsResolved: 0,
  totalNumberStillLocked: 0,
  triggerResolved: 0
})

export async function* processUserPerformanceSummaryReport(
  cursor: AsyncIterable<UserSummaryRow[]>,
  fromDate: Date,
  toDate: Date
): AsyncGenerator<UserPerformanceSummaryDto> {
  const normalizedStartDate = startOfDay(fromDate)

  let expectedDate = endOfDay(toDate)
  let expectedDateStr = formatDate(expectedDate)

  let currentUsers: UserForPerformanceSummaryDto[] = []
  let currentTotals = emptyTotals()

  for await (const rows of cursor) {
    for (const row of rows) {
      const rowDateStr = formatDate(new Date(row.report_date))

      while (rowDateStr !== expectedDateStr && isBefore(row.report_date, expectedDate)) {
        yield [{ date: expectedDate, totals: currentTotals, users: currentUsers }]

        currentUsers = []
        currentTotals = emptyTotals()
        expectedDate = subDays(expectedDate, 1)
        expectedDateStr = formatDate(expectedDate)
      }

      const userDto = convertRowToUserForPerformanceSummaryDto(row)

      currentTotals.exceptionsResolved += userDto.exceptionsResolved
      currentTotals.triggerResolved += userDto.triggerResolved
      currentTotals.totalNumberStillLocked += userDto.totalNumberStillLocked

      currentUsers.push(userDto)
    }
  }

  yield [{ date: expectedDate, totals: currentTotals, users: currentUsers }]

  expectedDate = subDays(expectedDate, 1)

  while (!isBefore(expectedDate, normalizedStartDate)) {
    yield [{ date: expectedDate, totals: emptyTotals(), users: [] }]
    expectedDate = subDays(expectedDate, 1)
  }
}
