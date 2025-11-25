import convertPncDateTimeToLedsDateTime from "./convertPncDateTimeToLedsDateTime"

describe("convertPncDateTimeToLedsDateTime", () => {
  it("should convert date when time is missing", () => {
    const result = convertPncDateTimeToLedsDateTime("10062025")
    expect(result.date).toBe("2025-06-10")
    expect(result.time).toBeUndefined()
  })

  it("should convert a BST summer date to UTC with one hour offset", () => {
    const result = convertPncDateTimeToLedsDateTime("10062025", "0245")
    expect(result.date).toBe("2025-06-10")
    expect(result.time).toBe("02:45+01:00")
  })

  it("should convert a winter BST date with no offset", () => {
    const result = convertPncDateTimeToLedsDateTime("10012025", "0245")
    expect(result.date).toBe("2025-01-10")
    expect(result.time).toBe("02:45+00:00")
  })

  it("should handle midnight with BST offset", () => {
    const result = convertPncDateTimeToLedsDateTime("15072025", "0010")
    expect(result.date).toBe("2025-07-15")
    expect(result.time).toBe("00:10+01:00")
  })

  it("should handle midnight in winter with no offset", () => {
    const result = convertPncDateTimeToLedsDateTime("15122025", "0010")
    expect(result.date).toBe("2025-12-15")
    expect(result.time).toBe("00:10+00:00")
  })
})
