import dedupeTriggerCode from "./dedupeTriggerCodes"

describe("dedupeTriggerCodes", () => {
  it("returns the short code when long and short codes present for the same trigger", () => {
    const result = dedupeTriggerCode(["TRPR0001", "PR01"])

    expect(result).toEqual(["PR01"])
  })

  it("does not shorten non-duplicated codes", () => {
    const result = dedupeTriggerCode(["TRPR0001", "PR01", "TRPR0002"])

    expect(result).toEqual(["PR01", "TRPR0002"])
  })

  it("removes duplicate long codes", () => {
    const result = dedupeTriggerCode(["TRPR0001", "TRPR0003", "TRPR0001", "PR03"])

    expect(result).toEqual(["TRPR0001", "PR03"])
  })

  it("removes duplicate short codes", () => {
    const result = dedupeTriggerCode(["PR03", "TRPR0001", "PR03"])

    expect(result).toEqual(["TRPR0001", "PR03"])
  })

  it("sorts codes by numerical value", () => {
    const result = dedupeTriggerCode(["TRPR0003", "HO100302", "TRPR0001", "PR05", "PS02", "TRPR0002"])

    expect(result).toEqual(["TRPR0001", "PS02", "TRPR0002", "TRPR0003", "PR05", "HO100302"])
  })

  it("returns doesn't care about lowercase", () => {
    const result = dedupeTriggerCode(["TRPR0001", "PR01", "trpr0001", "pr01", "ho100302"])

    expect(result).toEqual(["PR01", "HO100302"])
  })
})
