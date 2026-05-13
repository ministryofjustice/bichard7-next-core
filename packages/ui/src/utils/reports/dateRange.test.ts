import { parseISO, endOfMonth, startOfMonth, subMonths } from "date-fns"
import { dateRange } from "./dateRange"

const TODAY = new Date(2026, 4, 12)

beforeEach(() => {
  jest.useFakeTimers()
  jest.setSystemTime(TODAY)
})

afterEach(() => {
  jest.useRealTimers()
})

describe("dateRange", () => {
  describe("when dateFrom is beyond the 12-month limit", () => {
    it("returns an error", () => {
      const result = dateRange(parseISO("2025-04-30"))

      expect(result).toBeInstanceOf(Error)
      expect((result as Error).message).toBe("Date cannot be more than 12 months ago")
    })
  })

  describe("when dateFrom is the 1st of a past month", () => {
    it("returns the full calendar month", () => {
      const result = dateRange(parseISO("2025-10-01")) as { startDate: Date; endDate: Date }

      expect(result.startDate).toEqual(parseISO("2025-10-01"))
      expect(result.endDate).toEqual(endOfMonth(parseISO("2025-10-01")))
    })

    it("handles a 30-day month correctly", () => {
      const result = dateRange(parseISO("2025-11-01")) as { startDate: Date; endDate: Date }

      expect(result.endDate).toEqual(endOfMonth(parseISO("2025-11-01")))
    })

    it("handles February correctly", () => {
      const result = dateRange(parseISO("2026-02-01")) as { startDate: Date; endDate: Date }

      expect(result.endDate).toEqual(endOfMonth(parseISO("2026-02-01")))
    })
  })

  describe("when dateFrom is the 1st of the current month", () => {
    it("caps endDate at today rather than end of month", () => {
      const result = dateRange(parseISO("2026-05-01")) as { startDate: Date; endDate: Date }

      expect(result.startDate).toEqual(parseISO("2026-05-01"))
      expect(result.endDate).toEqual(TODAY)
    })
  })

  describe("when dateFrom is a mid-month day in a past month", () => {
    it("returns 1 calendar month ahead", () => {
      const result = dateRange(parseISO("2025-09-15")) as { startDate: Date; endDate: Date }

      expect(result.startDate).toEqual(parseISO("2025-09-15"))
      expect(result.endDate).toEqual(parseISO("2025-10-15"))
    })

    it("clamps correctly when the month is shorter (e.g. Jan 31 → Feb 28)", () => {
      const result = dateRange(parseISO("2026-01-31")) as { startDate: Date; endDate: Date }

      expect(result.endDate).toEqual(parseISO("2026-02-28"))
    })
  })

  describe("when dateFrom is a mid-month day in the current month", () => {
    it("caps endDate at today", () => {
      const result = dateRange(parseISO("2026-05-05")) as { startDate: Date; endDate: Date }

      expect(result.endDate).toEqual(TODAY)
    })
  })

  describe("when dateFrom is today", () => {
    it("returns a single-day range", () => {
      const result = dateRange(TODAY) as { startDate: Date; endDate: Date }

      expect(result.startDate).toEqual(TODAY)
      expect(result.endDate).toEqual(TODAY)
    })
  })

  describe("boundary: exactly 12 months ago (the first of that month)", () => {
    it("is accepted and returns the full month", () => {
      const boundary = startOfMonth(subMonths(TODAY, 12)) // 2025-05-01
      const result = dateRange(boundary) as { startDate: Date; endDate: Date }

      expect(result.startDate).toEqual(boundary)
      expect(result.endDate).toEqual(endOfMonth(boundary)) // 2025-05-31
    })
  })
})
