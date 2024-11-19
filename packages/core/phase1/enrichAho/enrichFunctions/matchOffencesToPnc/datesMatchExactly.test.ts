import { createHOOffence, createPNCCourtCaseOffence } from "../../../tests/helpers/generateMockOffences"
import { datesMatchExactly } from "./datesMatchExactly"

describe("datesMatchExactly", () => {
  it("should be true when there's an exact match for only start dates", () => {
    const hoOffence = createHOOffence({ startDate: "2024-03-18" })
    const pncOffence = createPNCCourtCaseOffence({ startDate: "2024-03-18" })

    const result = datesMatchExactly(hoOffence, pncOffence)
    expect(result).toBe(true)
  })

  it("should be false when the start date doesn't match", () => {
    const hoOffence = createHOOffence({ startDate: "2024-03-17" })
    const pncOffence = createPNCCourtCaseOffence({ startDate: "2024-03-18" })

    const result = datesMatchExactly(hoOffence, pncOffence)
    expect(result).toBe(false)
  })

  it("should be true when there's an exact match for start and end dates", () => {
    const hoOffence = createHOOffence({ startDate: "2024-03-17", endDate: "2024-03-18" })
    const pncOffence = createPNCCourtCaseOffence({ startDate: "2024-03-17", endDate: "2024-03-18" })

    const result = datesMatchExactly(hoOffence, pncOffence)
    expect(result).toBe(true)
  })

  it("should be false when the end date doesn't match", () => {
    const hoOffence = createHOOffence({ startDate: "2024-03-17", endDate: "2024-03-17" })
    const pncOffence = createPNCCourtCaseOffence({ startDate: "2024-03-17", endDate: "2024-03-18" })

    const result = datesMatchExactly(hoOffence, pncOffence)
    expect(result).toBe(false)
  })
})
