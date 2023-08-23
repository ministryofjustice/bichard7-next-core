import removeSeconds from "phase1/parse/transformSpiToAho/removeSeconds"

it("should remove seconds from the time", () => {
  const result = removeSeconds("12:10:33")

  expect(result).toBe("12:10")
})

it("should return the same time when time does not contain seconds", () => {
  const result = removeSeconds("16:12")

  expect(result).toBe("16:12")
})

it("should return the original string when time format is invalid", () => {
  const result = removeSeconds("ab:cd:ef")

  expect(result).toBe("ab:cd:ef")
})
