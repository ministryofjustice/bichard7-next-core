import { validCaseDetailsTabs } from "types/CaseDetailsTab"
import { isValidCaseDetailsTab } from "./isValidCaseDetailsTab"

describe("isValidCaseDetailsTab", () => {
  it.each(validCaseDetailsTabs)("%s should be a valid tab", (tab) => {
    const result = isValidCaseDetailsTab(tab)
    expect(result).toBe(true)
  })

  it("Should return false for an invalid tab", () => {
    const result = isValidCaseDetailsTab("wrong")
    expect(result).toBe(false)
  })
})
