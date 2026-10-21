import filterExcludedTriggers from "./filterExcludedTriggers"

describe("filterExcludedTriggers", () => {
  it("should return an empty array when excludedTriggers is undefined or empty", () => {
    expect(filterExcludedTriggers()).toEqual([])
    expect(filterExcludedTriggers([])).toEqual([])
    expect(filterExcludedTriggers(undefined, ["trigger1"])).toEqual([])
  })

  it("should return all excludedTriggers when includedTriggers is undefined or empty", () => {
    const excluded = ["trigger1", "trigger2"]
    expect(filterExcludedTriggers(excluded)).toEqual(["trigger1", "trigger2"])
    expect(filterExcludedTriggers(excluded, [])).toEqual(["trigger1", "trigger2"])
    expect(filterExcludedTriggers(excluded, undefined)).toEqual(["trigger1", "trigger2"])
  })

  it("should filter out triggers present in includedTriggers", () => {
    const excluded = ["trigger1", "trigger2", "trigger3"]
    const included = ["trigger2"]

    expect(filterExcludedTriggers(excluded, included)).toEqual(["trigger1", "trigger3"])
  })

  it("should return an empty array if all excludedTriggers are included", () => {
    const excluded = ["trigger1", "trigger2"]
    const included = ["trigger1", "trigger2", "trigger3"]

    expect(filterExcludedTriggers(excluded, included)).toEqual([])
  })
})
