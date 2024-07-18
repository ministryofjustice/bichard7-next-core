import { validateAmountSpecifiedInResult } from "./ahoValidations"

describe("validations", () => {
  describe("validateAmountSpecifiedInResult", () => {
    it("should return true if the number is valid", () => {
      const valid = validateAmountSpecifiedInResult({ Amount: 10, DecimalPlaces: 2 })
      expect(valid).toBeTruthy()
    })

    it("should return false if the number is greater than 999999999999.99", () => {
      const valid = validateAmountSpecifiedInResult({ Amount: 1000000000000, DecimalPlaces: 2 })
      expect(valid).toBeFalsy()
    })

    it("should return false if the number is less than 0.01", () => {
      const valid = validateAmountSpecifiedInResult({ Amount: 0.001, DecimalPlaces: 2 })
      expect(valid).toBeFalsy()
    })

    it("should return false if there are more than 14 digits", () => {
      const valid = validateAmountSpecifiedInResult({ Amount: 123456789.123456, DecimalPlaces: 2 })
      expect(valid).toBeFalsy()
    })

    it("should return false if there are more than 2 fraction digits", () => {
      const valid = validateAmountSpecifiedInResult({ Amount: 12345.123456, DecimalPlaces: 2 })
      expect(valid).toBeFalsy()
    })
  })
})
