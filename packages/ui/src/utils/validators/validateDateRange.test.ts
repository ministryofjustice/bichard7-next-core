import { validateDateRange } from "./validateDateRange"

describe("validateDateRange", () => {
  it("Should return a date range for a valid from and to date", () => {
    const expectedToDate = new Date("2022-01-01")
    const expectedFromDate = new Date("2022-12-31")

    const result = validateDateRange({
      from: "2022-01-01",
      to: "2022-12-31"
    })
    expect(result).toEqual({ from: expectedToDate, to: expectedFromDate })
  })

  it("Should return undefined if one of the date parameters is undefined", () => {
    const result = validateDateRange({
      from: undefined,
      to: "2022-12-31"
    })
    expect(result).toBeUndefined()
  })

  it("Should return undefined if one of the date parameters is an invalid input", () => {
    const result = validateDateRange({
      from: "invalid-input!",
      to: "2022-12-31"
    })
    expect(result).toBeUndefined()
  })
})
