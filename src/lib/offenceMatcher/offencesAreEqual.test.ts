import { createHOOffence } from "tests/helpers/generateMockOffences"
import offencesAreEqual from "./offencesAreEqual"

describe("offencesAreEqual()", () => {
  it("returns true if all attributes match", () => {
    const offence1 = createHOOffence({ startDate: "2022-05-20", endDate: "2022-05-22", resultCodes: ["1234", "5678"] })
    const offence2 = createHOOffence({ startDate: "2022-05-20", endDate: "2022-05-22", resultCodes: ["1234", "5678"] })
    const result = offencesAreEqual(offence1, offence2)
    expect(result).toBe(true)
  })

  it("returns true if all attributes match with no end dates", () => {
    const offence1 = createHOOffence({ startDate: "2022-05-20", resultCodes: ["1234", "5678"] })
    const offence2 = createHOOffence({ startDate: "2022-05-20", resultCodes: ["1234", "5678"] })
    const result = offencesAreEqual(offence1, offence2)
    expect(result).toBe(true)
  })

  it("returns false if result codes are different", () => {
    const offence1 = createHOOffence({ startDate: "2022-05-20", endDate: "2022-05-22", resultCodes: ["1234", "5679"] })
    const offence2 = createHOOffence({ startDate: "2022-05-20", endDate: "2022-05-22", resultCodes: ["1234", "5678"] })
    const result = offencesAreEqual(offence1, offence2)
    expect(result).toBe(false)
  })

  it("returns false if end dates are different", () => {
    const offence1 = createHOOffence({ startDate: "2022-05-20", endDate: "2022-05-23", resultCodes: ["1234", "5678"] })
    const offence2 = createHOOffence({ startDate: "2022-05-20", endDate: "2022-05-22", resultCodes: ["1234", "5678"] })
    const result = offencesAreEqual(offence1, offence2)
    expect(result).toBe(false)
  })

  it("returns false if start dates are different", () => {
    const offence1 = createHOOffence({ startDate: "2022-05-19", endDate: "2022-05-23", resultCodes: ["1234", "5678"] })
    const offence2 = createHOOffence({ startDate: "2022-05-20", endDate: "2022-05-22", resultCodes: ["1234", "5678"] })
    const result = offencesAreEqual(offence1, offence2)
    expect(result).toBe(false)
  })

  it("returns false if offence codes are different", () => {
    const offence1 = createHOOffence({
      reason: "011",
      startDate: "2022-05-19",
      endDate: "2022-05-22",
      resultCodes: ["1234", "5678"]
    })
    const offence2 = createHOOffence({ startDate: "2022-05-20", endDate: "2022-05-22", resultCodes: ["1234", "5678"] })
    const result = offencesAreEqual(offence1, offence2)
    expect(result).toBe(false)
  })

  it("ignores dates if the offence is breach and ignoreBreachDates is true", () => {
    const offence1 = createHOOffence({
      startDate: "2022-05-19",
      resultCodes: ["1234", "5678"],
      offenceCategory: "CB"
    })
    const offence2 = createHOOffence({
      startDate: "2022-05-20",
      resultCodes: ["1234", "5678"],
      offenceCategory: "CB"
    })
    const result = offencesAreEqual(offence1, offence2, true)
    expect(result).toBe(true)
  })
})
