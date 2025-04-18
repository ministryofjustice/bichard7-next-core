import type { DateRange } from "@moj-bichard7/common/types/DateRange"

export const validateDateRange = (dateRange: {
  from: string | string[] | undefined
  to: string | string[] | undefined
}): DateRange | undefined => {
  const fromTimeStamp = Date.parse(`${dateRange.from}`)
  const toTimeStamp = Date.parse(`${dateRange.to}`)

  if (isNaN(fromTimeStamp) || isNaN(toTimeStamp)) {
    return undefined
  }

  return { from: new Date(fromTimeStamp), to: new Date(toTimeStamp) }
}
