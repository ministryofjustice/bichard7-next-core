import removeSeconds from "./removeSeconds"

it("should remove seconds from the time", () => {
  const result = removeSeconds("12:10:33")

  expect(result).toBe("12:10")
})

it("should return the same time when time does not contain seconds", () => {
  const result = removeSeconds("16:12")

  expect(result).toBe("16:12")
})

it("should throw error when time format is invalid", () => {
  expect(() => removeSeconds("ab:cd:ef")).toThrow("Invalid time value")
})
