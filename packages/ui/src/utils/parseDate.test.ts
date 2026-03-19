import parseDate from "./parseDate"

describe("parseDate", () => {
  it("should parse valid date string", () => {
    const result = parseDate("2026-01-01", "yyyy-MM-dd", new Date())

    expect(result).toEqual(new Date(2026, 0, 1))
  })

  it("should use default date if date string is invalid", () => {
    const result = parseDate("", "yyyy-MM-dd", new Date(2026, 0, 5))

    expect(result).toEqual(new Date(2026, 0, 5))
  })
})
