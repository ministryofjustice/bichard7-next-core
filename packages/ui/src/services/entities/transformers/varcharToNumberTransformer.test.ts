import varcharToNumberTransformer from "./varcharToNumberTransformer"

describe("varcharToNumberTransformer", () => {
  describe("to() - Entity to Database", () => {
    it("should convert a valid integer string to a number", () => {
      expect(varcharToNumberTransformer.to("123")).toBe(123)
    })

    it("should convert a valid float string to a number", () => {
      expect(varcharToNumberTransformer.to("99.99")).toBe(99.99)
    })

    it("should return null for non-numeric strings", () => {
      expect(varcharToNumberTransformer.to("abc")).toBeNull()
      expect(varcharToNumberTransformer.to("123abc")).toBeNull()
    })

    it("should return 0 for an empty string", () => {
      expect(varcharToNumberTransformer.to("")).toBeNull()
    })

    it("should return 0 when database value is null", () => {
      expect(varcharToNumberTransformer.to(null)).toBeNull()
    })

    it("should return 0 when database value is a boolean string implicitly coerced", () => {
      expect(varcharToNumberTransformer.to(false as any)).toBeNull()
    })
  })

  describe("from() - Database to Entity", () => {
    it("should convert positive numbers to a string", () => {
      expect(varcharToNumberTransformer.from(123)).toBe(123)
    })

    it("should convert negative numbers to a string", () => {
      expect(varcharToNumberTransformer.from(-45.6)).toBe(-45.6)
    })

    it("should convert zero to a string", () => {
      expect(varcharToNumberTransformer.from(0)).toBeNull()
    })

    it("should convert null or undefined to their string representations", () => {
      expect(varcharToNumberTransformer.from(null)).toBeNull()
      expect(varcharToNumberTransformer.from(undefined)).toBeNull()
    })
  })
})
