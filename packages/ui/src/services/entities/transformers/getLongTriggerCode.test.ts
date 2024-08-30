import getLongTriggerCode from "./getLongTriggerCode"

describe("getLongTriggerCode", () => {
  it("returns the short version of the trigger code", () => {
    const result = getLongTriggerCode("PR01")

    expect(result).toBe("TRPR0001")
  })

  it("handles 'PS' trigger codes", () => {
    const result = getLongTriggerCode("PS08")

    expect(result).toBe("TRPS0008")
  })

  it("handles double-digit trigger codes", () => {
    const result = getLongTriggerCode("PR11")

    expect(result).toBe("TRPR0011")
  })

  it("handles lowercase trigger codes", () => {
    const result = getLongTriggerCode("pr11")

    expect(result).toBe("TRPR0011")
  })

  it("returns passed value when it is an exception code", () => {
    const result = getLongTriggerCode("HO100302")

    expect(result).toBe("HO100302")
  })

  it("returns passed value when it is an exception code and lowercase", () => {
    const result = getLongTriggerCode("ho100302")

    expect(result).toBe("HO100302")
  })

  it("returns the passed value when trigger code is not a number", () => {
    const result = getLongTriggerCode("INVALID")

    expect(result).toBe("INVALID")
  })

  it("returns null when value is null", () => {
    const result = getLongTriggerCode(null)

    expect(result).toBe(null)
  })

  it("returns null when value is undefined", () => {
    const result = getLongTriggerCode()

    expect(result).toBe(null)
  })
})
