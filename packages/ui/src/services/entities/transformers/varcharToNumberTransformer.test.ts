import varcharToNumberTransformer from "./varcharToNumberTransformer"

describe("varcharToNumberTransformer", () => {
  describe("to() - Entity to Database", () => {
    it("should convert positive numbers to a string", () => {
      expect(varcharToNumberTransformer.to(123)).toBe("123")
    })

    it("should convert negative numbers to a string", () => {
      expect(varcharToNumberTransformer.to(-45.6)).toBe("-45.6")
    })

    it("should convert zero to a string", () => {
      expect(varcharToNumberTransformer.to(0)).toBe("0")
    })

    it("should convert null or undefined to their string representations", () => {
      expect(varcharToNumberTransformer.to(null)).toBe("null")
      expect(varcharToNumberTransformer.to(undefined)).toBe("undefined")
    })
  })

  describe("from() - Database to Entity", () => {
    it("should convert a valid integer string to a number", () => {
      expect(varcharToNumberTransformer.from("123")).toBe(123)
    })

    it("should convert a valid float string to a number", () => {
      expect(varcharToNumberTransformer.from("99.99")).toBe(99.99)
    })

    it("should return null for non-numeric strings", () => {
      expect(varcharToNumberTransformer.from("abc")).toBeNull()
      expect(varcharToNumberTransformer.from("123abc")).toBeNull()
    })

    it("should return 0 for an empty string", () => {
      expect(varcharToNumberTransformer.from("")).toBe(0)
    })

    it("should return 0 when database value is null", () => {
      expect(varcharToNumberTransformer.from(null)).toBe(0)
    })

    it("should return 0 when database value is a boolean string implicitly coerced", () => {
      expect(varcharToNumberTransformer.from(false as any)).toBe(0)
    })
  })
})
