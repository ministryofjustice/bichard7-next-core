import { escapeCsvCell } from "./escapeCsvCell"

describe("escapeCsvCell", () => {
  describe("Falsy and Empty Values", () => {
    it("should return empty quotes for null", () => {
      expect(escapeCsvCell(null)).toBe('""')
    })

    it("should return empty quotes for undefined", () => {
      expect(escapeCsvCell(undefined)).toBe('""')
    })

    it("should return empty quotes for an empty string", () => {
      expect(escapeCsvCell("")).toBe('""')
    })

    it("should preserve 0 as a string instead of treating it as empty", () => {
      expect(escapeCsvCell(0)).toBe('"0"')
    })
  })

  describe("String Handling & Escaping", () => {
    it("should wrap a standard string in double quotes", () => {
      expect(escapeCsvCell("Standard text")).toBe('"Standard text"')
    })

    it("should escape existing double quotes by doubling them", () => {
      expect(escapeCsvCell('Text with "quotes" inside')).toBe('"Text with ""quotes"" inside"')
    })

    it("should handle strings that are entirely quotes", () => {
      expect(escapeCsvCell('"')).toBe('""""')
    })

    it("should safely wrap strings containing commas", () => {
      expect(escapeCsvCell("City, State")).toBe('"City, State"')
    })

    it("should safely wrap strings containing newlines", () => {
      expect(escapeCsvCell("Line 1\nLine 2")).toBe('"Line 1\nLine 2"')
    })
  })

  describe("Non-String Primitives", () => {
    it("should convert numbers to strings and wrap them", () => {
      expect(escapeCsvCell(12345)).toBe('"12345"')
    })

    it("should convert booleans to strings and wrap them", () => {
      expect(escapeCsvCell(true)).toBe('"true"')
      expect(escapeCsvCell(false)).toBe('"false"')
    })
  })

  describe("Complex Types (Objects & Arrays)", () => {
    it("should stringify objects instead of returning [object Object]", () => {
      const input = { id: 1, name: "Test" }
      expect(escapeCsvCell(input)).toBe('"{""id"":1,""name"":""Test""}"')
    })

    it("should stringify arrays correctly", () => {
      const input = [1, "two", 3]
      expect(escapeCsvCell(input)).toBe('"[1,""two"",3]"')
    })
  })
})
