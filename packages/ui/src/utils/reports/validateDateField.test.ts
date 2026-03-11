import { addDays, format, startOfToday, subDays } from "date-fns"
import { validateDateField } from "./validateDateField"
import {
  DATE_CANNOT_BE_IN_THE_FUTURE,
  DATE_SHOULD_BE_WITHIN_THE_LAST_31_DAYS,
  FIELD_REQUIRED
} from "./validationMessages"

describe("validateDateField", () => {
  const today = startOfToday()

  it("should return error if date string is empty", () => {
    expect(validateDateField("")).toBe(FIELD_REQUIRED)
  })

  it("should return error if input is invalid", () => {
    expect(validateDateField("invalid_date")).toBe(FIELD_REQUIRED)
  })

  it("should return error if date is more than 31 days ago", () => {
    const thirtyTwoDaysAgoStr = format(subDays(today, 32), "yyyy-MM-dd")
    expect(thirtyTwoDaysAgoStr).toBe("2026-02-07")
    expect(validateDateField(thirtyTwoDaysAgoStr)).toBe(DATE_SHOULD_BE_WITHIN_THE_LAST_31_DAYS)
  })

  it("should return error if date is in the future", () => {
    const tomorrowStr = format(addDays(today, 1), "yyyy-MM-dd")
    expect(validateDateField(tomorrowStr)).toBe(DATE_CANNOT_BE_IN_THE_FUTURE)
  })

  it("should return null for a valid date (today)", () => {
    const todayStr = format(today, "yyyy-MM-dd")
    expect(validateDateField(todayStr)).toBeNull()
  })
})
