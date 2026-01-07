import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import { findCourtCaseId } from "./findCourtCaseId"

describe("findCourtCase", () => {
  const dataset: PncUpdateDataset = {
    PncQuery: {
      courtCases: [
        {
          courtCaseReference: "CASE123",
          courtCaseId: "ID123",
          offences: [
            { offence: { sequenceNumber: 1, offenceId: "OFF-1" } },
            { offence: { sequenceNumber: 2, offenceId: "OFF-2" } }
          ]
        }
      ]
    }
  } as PncUpdateDataset

  it("returns the courtCaseId when a matching courtCaseReference exists", () => {
    const result = findCourtCaseId(dataset, "CASE123")
    expect(result).toBe("ID123")
  })

  it("returns undefined when no court case matches the given reference", () => {
    const result = findCourtCaseId(dataset, "CASE999")
    expect(result).toBeUndefined()
  })

  it("returns undefined when courtCaseReference is undefined", () => {
    const result = findCourtCaseId(dataset, undefined)
    expect(result).toBeUndefined()
  })

  it("returns undefined when there is no courtCase", () => {
    const dataset = { PncQuery: {} } as PncUpdateDataset
    const result = findCourtCaseId(dataset, "CASE123")
    expect(result).toBeUndefined()
  })
})
