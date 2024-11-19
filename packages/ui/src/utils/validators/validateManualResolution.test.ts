import type { ManualResolution } from "types/ManualResolution"

import { validateManualResolution } from "./validateManualResolution"

describe("validateManualResolution", () => {
  it.each([
    { expected: { valid: true }, input: { reason: "PNCRecordIsAccurate" } as ManualResolution },
    {
      expected: { error: "Reason text is required", valid: false },
      input: { reason: "Reallocated", reasonText: undefined } as ManualResolution
    },
    {
      expected: { error: "Reason text is required", valid: false },
      input: { reason: "Reallocated", reasonText: "" } as ManualResolution
    },
    { expected: { valid: true }, input: { reason: "Reallocated", reasonText: "Should be valid" } as ManualResolution }
  ])("test validateManualResolution with '$input' returns '$expected'", ({ expected, input }) => {
    expect(validateManualResolution(input)).toEqual(expected)
  })
})
