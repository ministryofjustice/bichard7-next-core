import { formatDate } from "./formatDate"

describe("Date Formatting with DST", () => {
  const originalTz = process.env.TZ

  beforeAll(() => {
    process.env.TZ = "UTC"
  })

  afterAll(() => {
    process.env.TZ = originalTz
  })

  it("works in Winter (No DST) because London GMT matches UTC", () => {
    const winterDate = "2023-01-01T12:00:00Z"

    const result = formatDate(winterDate, true)

    expect(result).toBe("01/01/2023 12:00")
  })

  it("ignores DST", () => {
    const summerDate = "2023-07-01T12:00:00Z"

    const result = formatDate(summerDate, true)

    expect(result).toBe("01/07/2023 12:00")
  })

  it("correctly handles Winter (No DST)", () => {
    const winterDate = "2023-01-01T12:00:00Z"

    const result = formatDate(winterDate, true, true)

    expect(result).toBe("01/01/2023 12:00")
  })

  it("correctly handles Summer (DST active)", () => {
    const summerDate = "2023-07-01T12:00:00Z"

    const result = formatDate(summerDate, true, true)

    expect(result).toBe("01/07/2023 13:00")
  })
})
