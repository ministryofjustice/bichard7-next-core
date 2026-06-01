import type { Result } from "@moj-bichard7/common/types/Result"
import { addMonths, endOfMonth, getDate, isBefore, min, startOfMonth, subMonths } from "date-fns"

type DateRange = {
  startDate: Date
  endDate: Date
}

export const dateRange = (dateFrom: Date): Result<DateRange> => {
  const today = new Date()
  const maxFromDate = startOfMonth(subMonths(today, 12))

  if (isBefore(dateFrom, maxFromDate)) {
    return new Error("Date cannot be more than 12 months ago")
  }

  const isFirstOfMonth = getDate(dateFrom) === 1
  const naturalEnd = isFirstOfMonth ? endOfMonth(dateFrom) : addMonths(dateFrom, 1)

  return {
    startDate: dateFrom,
    endDate: min([naturalEnd, today])
  }
}
