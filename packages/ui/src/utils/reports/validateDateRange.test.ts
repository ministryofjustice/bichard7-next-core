import { format, startOfToday, subDays } from "date-fns"
import { validateDateRange } from "./validateDateRange"
import { DATE_CANNOT_BE_AFTER_DATE_TO, DATE_CANNOT_BE_BEFORE_DATE_FROM } from "./validationMessages"

describe("validateDateRange", () => {
  const today = startOfToday()

  it("should return errors if 'Date From' is after 'Date To'", () => {
    const pastDateStr = format(subDays(today, 1), "yyyy-MM-dd")
    const currentDateStr = format(today, "yyyy-MM-dd")

    const result = validateDateRange(currentDateStr, pastDateStr)

    expect(result).toEqual({
      fromError: DATE_CANNOT_BE_AFTER_DATE_TO,
      toError: DATE_CANNOT_BE_BEFORE_DATE_FROM
    })
  })

  it("should return nulls for a valid range", () => {
    const todayStr = format(today, "yyyy-MM-dd")
    const result = validateDateRange(todayStr, todayStr)

    expect(result).toEqual({
      fromError: null,
      toError: null
    })
  })
})
