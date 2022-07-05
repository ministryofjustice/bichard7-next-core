import { validateAmountSpecifiedInResult } from "./ahoValidations"

describe("validations", () => {
  describe("validateAmountSpecifiedInResult", () => {
    it("should return true if the number is valid", () => {
      const valid = validateAmountSpecifiedInResult(10)
      expect(valid).toBeTruthy()
    })

    it("should return false if the number is greater than 999999999999.99", () => {
      const valid = validateAmountSpecifiedInResult(1000000000000)
      expect(valid).toBeFalsy()
    })

    it("should return false if the number is less than 0.01", () => {
      const valid = validateAmountSpecifiedInResult(0.001)
      expect(valid).toBeFalsy()
    })

    it("should return false if there are more than 14 digits", () => {
      const valid = validateAmountSpecifiedInResult(123456789.123456)
      expect(valid).toBeFalsy()
    })

    it("should return false if there are more than 2 fraction digits", () => {
      const valid = validateAmountSpecifiedInResult(12345.123456)
      expect(valid).toBeFalsy()
    })
  })
})
