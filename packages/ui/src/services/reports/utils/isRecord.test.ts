import { isRecord } from "./isRecord"

describe("isRecord", () => {
  it("should return true for plain objects", () => {
    expect(isRecord({})).toBe(true)
    expect(isRecord({ key: "value", num: 123 })).toBe(true)
  })

  it("should return false for null", () => {
    expect(isRecord(null)).toBe(false)
  })

  it("should return false for arrays", () => {
    expect(isRecord([])).toBe(false)
    expect(isRecord([{ key: "value" }])).toBe(false)
  })

  it("should return false for primitive types", () => {
    expect(isRecord("hello")).toBe(false)
    expect(isRecord(123)).toBe(false)
    expect(isRecord(0)).toBe(false)
    expect(isRecord(true)).toBe(false)
    expect(isRecord(false)).toBe(false)
    expect(isRecord(undefined)).toBe(false)
  })

  it("should return false for functions", () => {
    expect(isRecord(() => {})).toBe(false)
    expect(isRecord(function test() {})).toBe(false)
  })
})
