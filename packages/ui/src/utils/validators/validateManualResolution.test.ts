import { ManualResolution } from "types/ManualResolution"
import { validateManualResolution } from "./validateManualResolution"

describe("validateManualResolution", () => {
  it.each([
    { input: { reason: "PNCRecordIsAccurate" } as ManualResolution, expected: { valid: true } },
    {
      input: { reason: "Reallocated", reasonText: undefined } as ManualResolution,
      expected: { valid: false, error: "Reason text is required" }
    },
    {
      input: { reason: "Reallocated", reasonText: "" } as ManualResolution,
      expected: { valid: false, error: "Reason text is required" }
    },
    { input: { reason: "Reallocated", reasonText: "Should be valid" } as ManualResolution, expected: { valid: true } }
  ])("test validateManualResolution with '$input' returns '$expected'", ({ input, expected }) => {
    expect(validateManualResolution(input)).toEqual(expected)
  })
})
