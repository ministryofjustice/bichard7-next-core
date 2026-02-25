import { escapeCsvCell } from "./escapeCsvCell"

describe("escapeCsvCell", () => {
  it("should return empty quotes for null", () => {
    expect(escapeCsvCell(null)).toBe('""')
  })

  it("should return empty quotes for undefined", () => {
    expect(escapeCsvCell(undefined)).toBe('""')
  })

  it("should return empty quotes for an empty string", () => {
    expect(escapeCsvCell("")).toBe('""')
  })

  it("should wrap a standard string in double quotes", () => {
    expect(escapeCsvCell("Standard text")).toBe('"Standard text"')
  })

  it("should escape existing double quotes by doubling them", () => {
    expect(escapeCsvCell('Text with "quotes" inside')).toBe('"Text with ""quotes"" inside"')
  })

  it("should handle strings that are entirely quotes", () => {
    expect(escapeCsvCell('"')).toBe('""""')
  })

  it("should convert numbers to strings and wrap them", () => {
    expect(escapeCsvCell(12345)).toBe('"12345"')
    expect(escapeCsvCell(0)).toBe('"0"')
  })

  it("should convert booleans to strings and wrap them", () => {
    expect(escapeCsvCell(true)).toBe('"true"')
    expect(escapeCsvCell(false)).toBe('"false"')
  })

  it("should safely wrap strings containing commas", () => {
    expect(escapeCsvCell("City, State")).toBe('"City, State"')
  })

  it("should safely wrap strings containing newlines", () => {
    expect(escapeCsvCell("Line 1\nLine 2")).toBe('"Line 1\nLine 2"')
  })
})
