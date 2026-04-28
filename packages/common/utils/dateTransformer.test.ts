import dateTransformer, { dateReviver } from "./dateTransformer" // Adjust path as needed

describe("dateReviver", () => {
  it("should convert a valid ISO date string to a Date object", () => {
    const isoString = "2023-10-25T14:30:00Z"
    const result = dateReviver("", isoString) as Date
    expect(result).toBeInstanceOf(Date)
    expect(result.getTime()).toBe(new Date(isoString).getTime())
  })

  it("should convert a short date string (YYYY-MM-DD) to a Date object", () => {
    const shortDate = "2023-10-25"
    const result = dateReviver("", shortDate)
    expect(result).toBeInstanceOf(Date)
  })

  it("should return the original string if it is not a valid date format", () => {
    const notADate = "Invalid date"
    const result = dateReviver("", notADate)
    expect(result).toBe("Invalid date")
  })

  it("should return the original value if it is not a string", () => {
    const numberValue = 12345
    const result = dateReviver("", numberValue)
    expect(result).toBe(12345)
  })
})

describe("dateTransformer logic", () => {
  it("should return an empty object when input is an empty string", () => {
    expect(dateTransformer("")).toEqual({})
  })

  it("should parse a standard JSON object and not affect non-date values", () => {
    const json = '{"prop1": "data1", "prop2": 2}'
    const result = dateTransformer(json)
    expect(result).toEqual({ prop1: "data1", prop2: 2 })
  })

  it("should parse nested dates within a JSON object", () => {
    const json = JSON.stringify({
      createdAt: "2023-10-25T10:00:00Z",
      id: 1,
      nested: {
        updatedAt: "2023-10-26T12:00:00Z"
      }
    })

    const result = dateTransformer(json)

    expect(result.createdAt).toBeInstanceOf(Date)
    expect(result.nested.updatedAt).toBeInstanceOf(Date)
    expect(result.id).toBe(1)
  })
})
