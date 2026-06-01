import { addDays, addMonths, endOfMonth, format, startOfMonth, startOfToday, subDays, subMonths } from "date-fns"
import { validateDateRange } from "./validateDateRange"
import {
  DATE_CANNOT_BE_AFTER_DATE_TO,
  DATE_CANNOT_BE_BEFORE_DATE_FROM,
  DATE_CANNOT_BE_IN_THE_FUTURE,
  DATE_EXCEEDS_MAX_RANGE,
  DATE_SHOULD_BE_WITHIN_THE_LAST_12_MONTHS,
  FIELD_REQUIRED
} from "./validationMessages"

const fmt = (date: Date) => format(date, "yyyy-MM-dd")

describe("validateDateRange", () => {
  const today = startOfToday()
  const earliest = startOfMonth(subMonths(today, 12))

  describe("missing or invalid dates", () => {
    it("returns FIELD_REQUIRED for both when both are empty", () => {
      expect(validateDateRange("", "")).toEqual({
        fromError: FIELD_REQUIRED,
        toError: FIELD_REQUIRED
      })
    })

    it("returns FIELD_REQUIRED for dateFrom when only dateFrom is empty", () => {
      expect(validateDateRange("", fmt(today))).toEqual({
        fromError: FIELD_REQUIRED,
        toError: null
      })
    })

    it("returns FIELD_REQUIRED for dateTo when only dateTo is empty", () => {
      expect(validateDateRange(fmt(today), "")).toEqual({
        fromError: null,
        toError: FIELD_REQUIRED
      })
    })

    it("returns FIELD_REQUIRED for an invalid dateFrom string", () => {
      expect(validateDateRange("not-a-date", fmt(today))).toEqual({
        fromError: FIELD_REQUIRED,
        toError: null
      })
    })

    it("returns FIELD_REQUIRED for an invalid dateTo string", () => {
      expect(validateDateRange(fmt(today), "not-a-date")).toEqual({
        fromError: null,
        toError: FIELD_REQUIRED
      })
    })
  })

  describe("future dates", () => {
    it("returns an error when dateFrom is in the future", () => {
      expect(validateDateRange(fmt(addDays(today, 1)), fmt(addDays(today, 2)))).toEqual({
        fromError: DATE_CANNOT_BE_IN_THE_FUTURE,
        toError: DATE_CANNOT_BE_IN_THE_FUTURE
      })
    })

    it("returns an error when only dateTo is in the future", () => {
      expect(validateDateRange(fmt(today), fmt(addDays(today, 1)))).toEqual({
        fromError: null,
        toError: DATE_CANNOT_BE_IN_THE_FUTURE
      })
    })
  })

  describe("dates beyond the 12-month limit", () => {
    it("returns an error when dateFrom is before the earliest allowed date", () => {
      expect(validateDateRange(fmt(subDays(earliest, 1)), fmt(today))).toEqual({
        fromError: DATE_SHOULD_BE_WITHIN_THE_LAST_12_MONTHS,
        toError: null
      })
    })

    it("returns an error when dateTo is before the earliest allowed date", () => {
      expect(validateDateRange(fmt(earliest), fmt(subDays(earliest, 1)))).toEqual({
        fromError: null,
        toError: DATE_SHOULD_BE_WITHIN_THE_LAST_12_MONTHS
      })
    })
  })

  describe("date order", () => {
    it("returns errors when dateFrom is after dateTo", () => {
      expect(validateDateRange(fmt(today), fmt(subDays(today, 1)))).toEqual({
        fromError: DATE_CANNOT_BE_AFTER_DATE_TO,
        toError: DATE_CANNOT_BE_BEFORE_DATE_FROM
      })
    })
  })

  describe("valid ranges", () => {
    it("returns no errors for the same day (single-day range)", () => {
      expect(validateDateRange(fmt(today), fmt(today))).toEqual({
        fromError: null,
        toError: null
      })
    })

    it("returns no errors when dateFrom is the 1st and dateTo is end of that month", () => {
      const firstOfLastMonth = startOfMonth(subMonths(today, 1))
      const endOfLastMonth = endOfMonth(firstOfLastMonth)

      expect(validateDateRange(fmt(firstOfLastMonth), fmt(endOfLastMonth))).toEqual({
        fromError: null,
        toError: null
      })
    })

    it("returns no errors for a mid-month start with dateTo exactly 1 month ahead", () => {
      const midMonth = new Date(2026, 3, 15)
      const to = addMonths(midMonth, 1)

      expect(validateDateRange(fmt(midMonth), fmt(to))).toEqual({
        fromError: null,
        toError: null
      })
    })

    it("returns no errors for the earliest allowed date with end of that month", () => {
      expect(validateDateRange(fmt(earliest), fmt(endOfMonth(earliest)))).toEqual({
        fromError: null,
        toError: null
      })
    })

    it("returns no errors when dateFrom is the 1st and dateTo is before end of month", () => {
      const firstOfLastMonth = startOfMonth(subMonths(today, 1))
      const midLastMonth = addDays(firstOfLastMonth, 14)

      expect(validateDateRange(fmt(firstOfLastMonth), fmt(midLastMonth))).toEqual({
        fromError: null,
        toError: null
      })
    })
  })

  describe("exceeding the 1-month range", () => {
    it("returns an error when dateTo exceeds 1 month after a mid-month dateFrom", () => {
      const from = subMonths(today, 2)
      const to = addDays(addMonths(from, 1), 1)

      expect(validateDateRange(fmt(from), fmt(to))).toEqual({
        fromError: null,
        toError: DATE_EXCEEDS_MAX_RANGE
      })
    })

    it("returns an error when dateTo exceeds end of month for a 1st-of-month dateFrom", () => {
      const firstOfTwoMonthsAgo = startOfMonth(subMonths(today, 2))
      const beyondEndOfMonth = addDays(endOfMonth(firstOfTwoMonthsAgo), 1)

      expect(validateDateRange(fmt(firstOfTwoMonthsAgo), fmt(beyondEndOfMonth))).toEqual({
        fromError: null,
        toError: DATE_EXCEEDS_MAX_RANGE
      })
    })
  })
})
