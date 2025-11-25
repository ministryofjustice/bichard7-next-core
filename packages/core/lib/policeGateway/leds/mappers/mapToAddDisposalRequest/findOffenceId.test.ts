import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import { findOffenceId } from "./findOffenceId"

describe("findOffenceId", () => {
  const dataset: PncUpdateDataset = {
    PncQuery: {
      courtCases: [
        {
          courtCaseReference: "CASE123",
          offences: [
            { offence: { sequenceNumber: 1, offenceId: "OFF-1" } },
            { offence: { sequenceNumber: 2, offenceId: "OFF-2" } }
          ]
        }
      ]
    }
  } as PncUpdateDataset

  it("returns correct offenceId when reference and sequence match", () => {
    expect(findOffenceId(dataset, "CASE123", "2")).toBe("OFF-2")
  })

  it("returns empty string when case reference not found", () => {
    expect(findOffenceId(dataset, "NOT_EXIST", "1")).toBe("")
  })

  it("returns empty string when offence sequence not found", () => {
    expect(findOffenceId(dataset, "CASE123", "99")).toBe("")
  })

  it("handles undefined gracefully", () => {
    expect(findOffenceId(dataset, undefined, undefined)).toBe("")
  })
})
