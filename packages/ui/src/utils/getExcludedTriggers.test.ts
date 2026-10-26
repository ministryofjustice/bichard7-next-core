import { getExcludedTriggers } from "./getExcludedTriggers"

describe("getExcludedTriggers", () => {
  it("returns an empty string array when no argument is provided", () => {
    expect(getExcludedTriggers()).toEqual([""])
  })

  it("returns an empty string array when an empty array is provided", () => {
    expect(getExcludedTriggers([])).toEqual([""])
  })

  it("returns a string array when given triggers", () => {
    const mockTriggers = ["Trigger1", "Trigger2"]
    expect(getExcludedTriggers(mockTriggers)).toEqual(["Trigger1", "Trigger2"])
  })
})
