import getShortTriggerCode from "./getShortTriggerCode"

describe("triggerCodeTransformer", () => {
  it("Should return the short version of the trigger code", () => {
    const result = getShortTriggerCode("TRPR0001")

    expect(result).toBe("PR01")
  })

  it("Should return the passed trigger code when trigger code is not a number", () => {
    const result = getShortTriggerCode("INVALID")

    expect(result).toBe("INVALID")
  })

  it("Should return null when trigger code is null", () => {
    const result = getShortTriggerCode(null)

    expect(result).toBe(null)
  })
})
