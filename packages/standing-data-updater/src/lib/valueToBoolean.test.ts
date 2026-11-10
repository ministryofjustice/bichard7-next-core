import { valueToBoolean } from "./valueToBoolean"

describe("valueToBoolean", () => {
  test.each(["Y", "y", true, " y "])("it converts true values to true", (value) => {
    expect(valueToBoolean(value)).toBe(true)
  })

  test.each(["n", "N", false, "N "])("it converts false values to false", (value) => {
    expect(valueToBoolean(value)).toBe(false)
  })

  test.each([undefined, null, "null", ""])("it converts undefined or null values to undefined", (value) => {
    expect(valueToBoolean(value)).toBeUndefined()
  })

  it("converts unknown values to undefined", () => {
    expect(valueToBoolean("nope")).toBeUndefined()
  })
})
