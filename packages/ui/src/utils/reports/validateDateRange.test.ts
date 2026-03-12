import { format, startOfToday, subDays } from "date-fns"
import { validateDateRange } from "./validateDateRange"
import { DATE_CANNOT_BE_AFTER_DATE_TO, DATE_CANNOT_BE_BEFORE_DATE_FROM } from "./validationMessages"

describe("validateDateRange", () => {
  const today = startOfToday()
  const thirtyOneDaysAgo = subDays(startOfToday(), 31)

  it("should return errors if 'Date From' is after 'Date To'", () => {
    const pastDateStr = format(subDays(today, 1), "yyyy-MM-dd")
    const currentDateStr = format(today, "yyyy-MM-dd")

    const result = validateDateRange(currentDateStr, pastDateStr)

    expect(result).toEqual({
      fromError: DATE_CANNOT_BE_AFTER_DATE_TO,
      toError: DATE_CANNOT_BE_BEFORE_DATE_FROM
    })
  })

  it("should return nulls for the minimum range allowed (1 day)", () => {
    const todayStr = format(today, "yyyy-MM-dd")
    const result = validateDateRange(todayStr, todayStr)

    expect(result).toEqual({
      fromError: null,
      toError: null
    })
  })

  it("should return nulls for the maximum range allowed (32 days)", () => {
    const todayStr = format(today, "yyyy-MM-dd")
    const thirtyOneDaysAgoStr = format(thirtyOneDaysAgo, "yyyy-MM-dd")
    const result = validateDateRange(thirtyOneDaysAgoStr, todayStr)
    expect(result).toEqual({
      fromError: null,
      toError: null
    })
  })
})
