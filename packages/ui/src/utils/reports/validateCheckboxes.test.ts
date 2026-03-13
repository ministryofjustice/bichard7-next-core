import { validateCheckboxes } from "./validateCheckboxes"

describe("validateCheckboxes", () => {
  it("should return error if reportType is 'exceptions' but no boxes checked", () => {
    const result = validateCheckboxes("exceptions", false, false)
    expect(result).toBe("At least one option must be selected")
  })

  it("should return null if reportType is 'exceptions' and triggers is checked", () => {
    const result = validateCheckboxes("exceptions", true, false)
    expect(result).toBeNull()
  })

  it("should return null for other report types even if boxes are unchecked", () => {
    const result = validateCheckboxes("bails", false, false)
    expect(result).toBeNull()
  })
})
