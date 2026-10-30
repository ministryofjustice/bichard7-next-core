import { validateResultCodeCheckboxes } from "./validateResultCodeCheckboxes"

describe("validateResultCodeCheckboxes", () => {
  it("should return error if reportType is 'community sentence' but no result codes selected", () => {
    const result = validateResultCodeCheckboxes("community sentence", [])
    expect(result).toBe("At least one option must be selected")
  })

  it("should return null if reportType is 'community sentence' and at least one result code selected", () => {
    const result = validateResultCodeCheckboxes("community sentence", ["1030"])
    expect(result).toBeNull()
  })

  it("should return null for other report types even if a result code is selected", () => {
    const result = validateResultCodeCheckboxes("bails", ["1030"])
    expect(result).toBeNull()
  })
})
