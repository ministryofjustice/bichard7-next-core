import hashString from "utils/hashString"

describe("hashString", () => {
  it("Should hash the string and output length should be as specified", () => {
    const result = hashString("String to be hashed 1", 10)

    expect(result).toHaveLength(20)
    expect(result).toBe("9bb2489d4ea64778d292")
  })

  it("Should generate different outputs for different inputs", () => {
    const result1 = hashString("String to be hashed 1")
    const result2 = hashString("Dummy string to hash")

    expect(result1).not.toBe(result2)
  })
})
