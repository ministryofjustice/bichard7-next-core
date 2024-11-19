import { createHOOffence, createPNCCourtCaseOffence } from "../../../tests/helpers/generateMockOffences"
import { datesMatchApproximately } from "./datesMatchApproximately"

describe("datesMatchApproximately", () => {
  it("should be true when there's an exact match for only start dates", () => {
    const hoOffence = createHOOffence({ startDate: "2024-03-19" })
    const pncOffence = createPNCCourtCaseOffence({ startDate: "2024-03-19" })

    const result = datesMatchApproximately(hoOffence, pncOffence)
    expect(result).toBe(true)
  })

  it("should be true when there's an exact match for start and end dates", () => {
    const hoOffence = createHOOffence({ startDate: "2024-03-16", endDate: "2024-03-18" })
    const pncOffence = createPNCCourtCaseOffence({ startDate: "2024-03-16", endDate: "2024-03-18" })

    const result = datesMatchApproximately(hoOffence, pncOffence)
    expect(result).toBe(true)
  })

  it("should be true when the start and end dates for the HO offence match the start date for the PNC offence", () => {
    const hoOffence = createHOOffence({ startDate: "2024-03-18", endDate: "2024-03-18" })
    const pncOffence = createPNCCourtCaseOffence({ startDate: "2024-03-18" })

    const result = datesMatchApproximately(hoOffence, pncOffence)
    expect(result).toBe(true)
  })

  describe("with no end date for the HO offence", () => {
    it("should be true when the date code is set to 'on or in' and the HO start date is within the PNC dates", () => {
      const hoOffence = createHOOffence({ startDate: "2024-03-18", offenceDateCode: "1" })
      const pncOffence = createPNCCourtCaseOffence({ startDate: "2024-03-17", endDate: "2024-03-19" })

      const result = datesMatchApproximately(hoOffence, pncOffence)
      expect(result).toBe(true)
    })

    it("should be false when the date code is set to 'on or in' and the HO start date is outside the PNC dates", () => {
      const hoOffence = createHOOffence({ startDate: "2024-03-16", offenceDateCode: "1" })
      const pncOffence = createPNCCourtCaseOffence({ startDate: "2024-03-17", endDate: "2024-03-19" })

      const result = datesMatchApproximately(hoOffence, pncOffence)
      expect(result).toBe(false)
    })

    it("should be true when the date code is set to 'on or about' and the HO start date is within the PNC dates", () => {
      const hoOffence = createHOOffence({ startDate: "2024-03-17", offenceDateCode: "5" })
      const pncOffence = createPNCCourtCaseOffence({ startDate: "2024-03-17", endDate: "2024-03-19" })

      const result = datesMatchApproximately(hoOffence, pncOffence)
      expect(result).toBe(true)
    })

    it("should be false when the date code is set to 'on or about' and the HO start date is outside the PNC dates", () => {
      const hoOffence = createHOOffence({ startDate: "2024-03-16", offenceDateCode: "5" })
      const pncOffence = createPNCCourtCaseOffence({ startDate: "2024-03-17", endDate: "2024-03-19" })

      const result = datesMatchApproximately(hoOffence, pncOffence)
      expect(result).toBe(false)
    })

    it("should be false when the date code is not set to 'on or in' or 'on or about'", () => {
      const hoOffence = createHOOffence({ startDate: "2024-03-18", offenceDateCode: "2" })
      const pncOffence = createPNCCourtCaseOffence({ startDate: "2024-03-17", endDate: "2024-03-19" })

      const result = datesMatchApproximately(hoOffence, pncOffence)
      expect(result).toBe(false)
    })
  })

  describe("with an end date for the HO offence", () => {
    it("should be true when the start date is within the PNC start and end dates", () => {
      const hoOffence = createHOOffence({ startDate: "2024-03-18", endDate: "2024-03-19" })
      const pncOffence = createPNCCourtCaseOffence({ startDate: "2024-03-17", endDate: "2024-03-19" })

      const result = datesMatchApproximately(hoOffence, pncOffence)
      expect(result).toBe(true)
    })

    it("should be false when the start date is outside the PNC start and end dates", () => {
      const hoOffence = createHOOffence({ startDate: "2024-03-16", endDate: "2024-03-19" })
      const pncOffence = createPNCCourtCaseOffence({ startDate: "2024-03-17", endDate: "2024-03-19" })

      const result = datesMatchApproximately(hoOffence, pncOffence)
      expect(result).toBe(false)
    })

    it("should be true when the end date is within the PNC start and end dates", () => {
      const hoOffence = createHOOffence({ startDate: "2024-03-18", endDate: "2024-03-17" })
      const pncOffence = createPNCCourtCaseOffence({ startDate: "2024-03-18", endDate: "2024-03-19" })

      const result = datesMatchApproximately(hoOffence, pncOffence)
      expect(result).toBe(true)
    })

    it("should be false when the end date is outside the PNC start and end dates", () => {
      const hoOffence = createHOOffence({ startDate: "2024-03-18", endDate: "2024-03-20" })
      const pncOffence = createPNCCourtCaseOffence({ startDate: "2024-03-18", endDate: "2024-03-19" })

      const result = datesMatchApproximately(hoOffence, pncOffence)
      expect(result).toBe(false)
    })
  })
})
