import { validateSelectReport } from "./validateSelectReport"
import { FIELD_REQUIRED } from "./validationMessages"

describe("validateSelectReport", () => {
  it("should return error if no report type selected", () => {
    expect(validateSelectReport(undefined)).toBe(FIELD_REQUIRED)
  })

  it("should return null if report type is provided", () => {
    expect(validateSelectReport("exceptions")).toBeNull()
  })
})
