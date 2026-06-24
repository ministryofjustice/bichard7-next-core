import { validateResolvedBy } from "./validateResolvedBy"
import { FIELD_REQUIRED } from "./validationMessages"

describe("validateResolvedBy", () => {
  it("should return error if resolved by is an empty array", () => {
    expect(validateResolvedBy([])).toBe(FIELD_REQUIRED)
  })

  it("should return error if resolved by is undefined", () => {
    expect(validateResolvedBy(undefined)).toBe(FIELD_REQUIRED)
  })

  it("should return null if resolved by is not empty", () => {
    expect(validateResolvedBy(["username"])).toBeNull()
  })
})
