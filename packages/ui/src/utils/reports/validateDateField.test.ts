import { addDays, format, startOfToday, subDays, subMonths } from "date-fns"
import { validateDateField } from "./validateDateField"
import {
  DATE_CANNOT_BE_IN_THE_FUTURE,
  FIELD_REQUIRED,
  DATE_SHOULD_BE_WITHIN_THE_LAST_12_MONTHS
} from "./validationMessages"

describe("validateDateField", () => {
  const today = startOfToday()
  const thirtyOneDaysAgo = subDays(startOfToday(), 31)

  it("should return error if date string is empty", () => {
    expect(validateDateField("")).toBe(FIELD_REQUIRED)
  })

  it("should return error if input is invalid", () => {
    expect(validateDateField("invalid_date")).toBe(FIELD_REQUIRED)
  })

  it("should return error if date is more than 12 months ago", () => {
    const over12MonthsAgo = format(subMonths(today, 13), "yyyy-MM-dd")
    expect(validateDateField(over12MonthsAgo)).toBe(DATE_SHOULD_BE_WITHIN_THE_LAST_12_MONTHS)
  })

  it("should return error if date is in the future", () => {
    const tomorrowStr = format(addDays(today, 1), "yyyy-MM-dd")
    expect(validateDateField(tomorrowStr)).toBe(DATE_CANNOT_BE_IN_THE_FUTURE)
  })

  it("should return null for a valid date (today)", () => {
    const todayStr = format(today, "yyyy-MM-dd")
    expect(validateDateField(todayStr)).toBeNull()
  })

  it("should return null for a valid date (31 days ago)", () => {
    const thirtyOneDaysAgoStr = format(thirtyOneDaysAgo, "yyyy-MM-dd")
    expect(validateDateField(thirtyOneDaysAgoStr)).toBeNull()
  })
})
