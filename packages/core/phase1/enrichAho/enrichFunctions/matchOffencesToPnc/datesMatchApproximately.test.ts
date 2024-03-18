import type { Offence } from "../../../../types/AnnotatedHearingOutcome"
import type { PncOffence } from "../../../../types/PncQueryResult"
import { datesMatchApproximately } from "./datesMatchApproximately"

const mockHoOffence = (startDate: string, endDate?: string, dateCode: string = "1"): Offence =>
  ({
    ActualOffenceStartDate: {
      StartDate: new Date(startDate)
    },
    ActualOffenceDateCode: dateCode,
    ...(endDate !== undefined ? { ActualOffenceEndDate: { EndDate: new Date(endDate) } } : {})
  }) as unknown as Offence

const mockPncOffence = (startDate: string, endDate?: string): PncOffence =>
  ({
    offence: {
      startDate: new Date(startDate),
      ...(endDate !== undefined ? { endDate: new Date(endDate) } : {})
    }
  }) as unknown as PncOffence

describe("datesMatchApproximately", () => {
  it("should be true when there's an exact match for only start dates", () => {
    const hoOffence = mockHoOffence("2024-03-18")
    const pncOffence = mockPncOffence("2024-03-18")

    const result = datesMatchApproximately(hoOffence, pncOffence)
    expect(result).toBe(true)
  })

  it("should be true when there's an exact match for start and end dates", () => {
    const hoOffence = mockHoOffence("2024-03-17", "2024-03-18")
    const pncOffence = mockPncOffence("2024-03-17", "2024-03-18")

    const result = datesMatchApproximately(hoOffence, pncOffence)
    expect(result).toBe(true)
  })

  it("should be true when the start and end dates for the HO offence match the start date for the PNC offence", () => {
    const hoOffence = mockHoOffence("2024-03-18", "2024-03-18")
    const pncOffence = mockPncOffence("2024-03-18")

    const result = datesMatchApproximately(hoOffence, pncOffence)
    expect(result).toBe(true)
  })

  describe("with no end date for the HO offence", () => {
    it("should be true when the date code is set to 'on or in' and the HO start date is within the PNC dates", () => {
      const hoOffence = mockHoOffence("2024-03-18", undefined, "1")
      const pncOffence = mockPncOffence("2024-03-17", "2024-03-19")

      const result = datesMatchApproximately(hoOffence, pncOffence)
      expect(result).toBe(true)
    })

    it("should be false when the date code is set to 'on or in' and the HO start date is outside the PNC dates", () => {
      const hoOffence = mockHoOffence("2024-03-16", undefined, "1")
      const pncOffence = mockPncOffence("2024-03-17", "2024-03-19")

      const result = datesMatchApproximately(hoOffence, pncOffence)
      expect(result).toBe(false)
    })

    it("should be true when the date code is set to 'on or about' and the HO start date is within the PNC dates", () => {
      const hoOffence = mockHoOffence("2024-03-18", undefined, "5")
      const pncOffence = mockPncOffence("2024-03-17", "2024-03-19")

      const result = datesMatchApproximately(hoOffence, pncOffence)
      expect(result).toBe(true)
    })

    it("should be false when the date code is set to 'on or about' and the HO start date is outside the PNC dates", () => {
      const hoOffence = mockHoOffence("2024-03-16", undefined, "5")
      const pncOffence = mockPncOffence("2024-03-17", "2024-03-19")

      const result = datesMatchApproximately(hoOffence, pncOffence)
      expect(result).toBe(false)
    })

    it("should be false when the date code is not set to 'on or in' or 'on or about'", () => {
      const hoOffence = mockHoOffence("2024-03-18", undefined, "2")
      const pncOffence = mockPncOffence("2024-03-17", "2024-03-19")

      const result = datesMatchApproximately(hoOffence, pncOffence)
      expect(result).toBe(false)
    })
  })

  describe("with an end date for the HO offence", () => {
    it("should be true when the start date is within the PNC start and end dates", () => {
      const hoOffence = mockHoOffence("2024-03-18", "2024-03-19")
      const pncOffence = mockPncOffence("2024-03-17", "2024-03-19")

      const result = datesMatchApproximately(hoOffence, pncOffence)
      expect(result).toBe(true)
    })

    it("should be false when the start date is outside the PNC start and end dates", () => {
      const hoOffence = mockHoOffence("2024-03-16", "2024-03-19")
      const pncOffence = mockPncOffence("2024-03-17", "2024-03-19")

      const result = datesMatchApproximately(hoOffence, pncOffence)
      expect(result).toBe(false)
    })

    it("should be true when the end date is within the PNC start and end dates", () => {
      const hoOffence = mockHoOffence("2024-03-18", "2024-03-17")
      const pncOffence = mockPncOffence("2024-03-18", "2024-03-19")

      const result = datesMatchApproximately(hoOffence, pncOffence)
      expect(result).toBe(true)
    })

    it("should be false when the end date is outside the PNC start and end dates", () => {
      const hoOffence = mockHoOffence("2024-03-18", "2024-03-20")
      const pncOffence = mockPncOffence("2024-03-18", "2024-03-19")

      const result = datesMatchApproximately(hoOffence, pncOffence)
      expect(result).toBe(false)
    })
  })
})
