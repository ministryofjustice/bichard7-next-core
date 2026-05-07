import type { UserPerformanceDetailDto } from "@moj-bichard7/common/types/reports/UserPerformanceDetail"

import { endOfDay, isBefore, startOfDay, subDays } from "date-fns"

import type { UserDetailJsonRow } from "../../../../types/reports/UserDetail"

import { mapToUserPerformanceDetailDtoDay } from "../../../dto/reports/mapToUserPerformanceDetailDtoDay"
import { formatDate } from "../utils/formatDate"

export async function* processUserPerformanceDetail(
  cursor: AsyncIterable<UserDetailJsonRow[]>,
  fromDate: Date,
  toDate: Date
): AsyncGenerator<UserPerformanceDetailDto[]> {
  const normalizedStartDate = startOfDay(fromDate)
  let expectedDate = endOfDay(toDate)
  let expectedDateStr = formatDate(expectedDate)

  for await (const rows of cursor) {
    for (const row of rows) {
      const rowDateStr = formatDate(new Date(row.report_date))

      while (rowDateStr !== expectedDateStr && isBefore(row.report_date, expectedDate)) {
        yield [mapToUserPerformanceDetailDtoDay(expectedDate)]
        expectedDate = subDays(expectedDate, 1)
        expectedDateStr = formatDate(expectedDate)
      }

      yield [mapToUserPerformanceDetailDtoDay(expectedDate, row)]

      expectedDate = subDays(expectedDate, 1)
      expectedDateStr = formatDate(expectedDate)
    }
  }

  while (!isBefore(expectedDate, normalizedStartDate)) {
    yield [mapToUserPerformanceDetailDtoDay(expectedDate)]
    expectedDate = subDays(expectedDate, 1)
  }
}
