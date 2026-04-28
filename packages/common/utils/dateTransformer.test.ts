import dateTransformer, { dateReviver } from "./dateTransformer"

describe("dateReviver", () => {
  it("should convert a valid ISO date string to a Date object", () => {
    const isoString = "2023-10-25T14:30:00Z"
    const result = dateReviver("", isoString) as Date
    expect(result).toBeInstanceOf(Date)
    expect(result.getTime()).toBe(new Date(isoString).getTime())
  })

  it("should convert a short date string (YYYY-MM-DD) to a Date object", () => {
    const shortDate = "2023-10-25"
    const result = dateReviver("", shortDate) as Date
    expect(result).toBeInstanceOf(Date)
  })

  it("should return the original string if it is not a valid date format", () => {
    const notADate = "Invalid date"
    const result = dateReviver("", notADate) as string
    expect(result).toBe("Invalid date")
  })

  it("should return the original value if it is not a string", () => {
    const numberValue = 12345
    const result = dateReviver("", numberValue) as number
    expect(result).toBe(12345)
  })
})

describe("dateTransformer logic", () => {
  it("should return an empty object when input is an empty string", () => {
    expect(dateTransformer("")).toEqual({})
  })

  it("should parse a standard JSON object and not affect non-date values", () => {
    const json = '{"prop1": "data1", "prop2": 2}'
    const result = dateTransformer(json) as { prop1: string; prop2: number }
    expect(result).toEqual({ prop1: "data1", prop2: 2 })
  })

  it("should parse nested dates within a JSON object", () => {
    const json = JSON.stringify({
      date1: "2023-10-25T10:00:00Z",
      id: 1,
      nested: {
        date2: "2023-10-26T12:00:00Z"
      }
    })

    const result = dateTransformer(json) as { date1: Date; id: number; nested: { date2: Date } }

    expect(result.date1).toBeInstanceOf(Date)
    expect(result.nested.date2).toBeInstanceOf(Date)
    expect(result.id).toBe(1)
  })
})

describe("dateTransformer Exception Handling", () => {
  it("should handle malformed JSON strings without crashing", () => {
    const malformedJson = '{"invalidJSON": "'
    expect(() => dateTransformer(malformedJson)).toThrow()
  })

  it("should handle 'null' or 'undefined' string inputs gracefully", () => {
    expect(dateTransformer("")).toEqual({})
    expect(dateTransformer("   ")).toEqual({})
  })

  it("should handle unexpected types in the reviver", () => {
    const json = JSON.stringify({ count: 123 })
    const result = dateTransformer<{ count: number }>(json) as { count: number }

    expect(result.count).toBe(123)
    expect(typeof result.count).toBe("number")
  })
})
