import { validateResolvedBy } from "./validateResolvedBy"
import { FIELD_REQUIRED } from "./validationMessages"

describe("validateResolvedBy", () => {
  it("should return error if resolved by is an empty array", () => {
    expect(validateResolvedBy("exceptions", [], true)).toBe(FIELD_REQUIRED)
  })

  it("should return error if resolved by is undefined", () => {
    expect(validateResolvedBy("exceptions", undefined, true)).toBe(FIELD_REQUIRED)
  })

  it("should return null if resolved by is not empty", () => {
    expect(validateResolvedBy("exceptions", ["username"], true)).toBeNull()
  })

  it("should return null if report type is not exceptions", () => {
    expect(validateResolvedBy("bails", ["username"], true)).toBeNull()
  })

  it("should return null if canUseTriggerAndExceptionQualityAuditing is false", () => {
    expect(validateResolvedBy("bails", ["username"], false)).toBeNull()
  })
})
