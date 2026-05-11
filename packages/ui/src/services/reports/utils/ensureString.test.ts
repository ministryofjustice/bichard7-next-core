import { ensureString } from "./ensureString"

describe("ensureString", () => {
  it("should return the exact string when a string is provided", () => {
    expect(ensureString("hello")).toBe("hello")
    expect(ensureString("")).toBe("")
    expect(ensureString("123")).toBe("123")
  })

  it("should return a stringified number when a number is provided", () => {
    expect(ensureString(123)).toBe("123")
    expect(ensureString(0)).toBe("0")
    expect(ensureString(-42.5)).toBe("-42.5")
    expect(ensureString(NaN)).toBe("NaN")
  })

  it("should return an empty string for any other data type", () => {
    expect(ensureString(null)).toBe("")
    expect(ensureString(undefined)).toBe("")
    expect(ensureString(true)).toBe("")
    expect(ensureString(false)).toBe("")
    expect(ensureString({ key: "value" })).toBe("")
    expect(ensureString([1, 2, 3])).toBe("")
    expect(ensureString(() => "test")).toBe("")
  })
})
