import isDriverDisqualificationResult, { driverDisqualificationCodes } from "./isDriverDisqualificationResult"

describe("isDriverDisqualificationResult", () => {
  it.each(driverDisqualificationCodes)(
    "should return true when PNC disposal type is %i",
    (driverDisqualificationCode) => {
      const result = isDriverDisqualificationResult(driverDisqualificationCode)

      expect(result).toBe(true)
    }
  )

  it("should return false when PNC disposal type is not in driver's disqualification codes list", () => {
    const result = isDriverDisqualificationResult(9999)

    expect(result).toBe(false)
  })

  it("should return false when PNC disposal type is undefined", () => {
    const result = isDriverDisqualificationResult(undefined)

    expect(result).toBe(false)
  })
})
