import type { Offence } from "../../../../types/AnnotatedHearingOutcome"
import type { PncOffence } from "../../../../types/PncQueryResult"
import { datesMatchExactly } from "./datesMatchExactly"

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

describe("datesMatchExactly", () => {
  it("should be true when there's an exact match for only start dates", () => {
    const hoOffence = mockHoOffence("2024-03-18")
    const pncOffence = mockPncOffence("2024-03-18")

    const result = datesMatchExactly(hoOffence, pncOffence)
    expect(result).toBe(true)
  })

  it("should be false when the start date doesn't match", () => {
    const hoOffence = mockHoOffence("2024-03-17")
    const pncOffence = mockPncOffence("2024-03-18")

    const result = datesMatchExactly(hoOffence, pncOffence)
    expect(result).toBe(false)
  })

  it("should be true when there's an exact match for start and end dates", () => {
    const hoOffence = mockHoOffence("2024-03-17", "2024-03-18")
    const pncOffence = mockPncOffence("2024-03-17", "2024-03-18")

    const result = datesMatchExactly(hoOffence, pncOffence)
    expect(result).toBe(true)
  })

  it("should be false when the end date doesn't match", () => {
    const hoOffence = mockHoOffence("2024-03-17", "2024-03-17")
    const pncOffence = mockPncOffence("2024-03-17", "2024-03-18")

    const result = datesMatchExactly(hoOffence, pncOffence)
    expect(result).toBe(false)
  })
})
