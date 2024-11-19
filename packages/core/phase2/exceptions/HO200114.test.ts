import type { Offence } from "../../types/AnnotatedHearingOutcome"

import ResultClass from "../../types/ResultClass"
import areAllResultsOnPnc from "../lib/areAllResultsOnPnc"
import generatePncUpdateDatasetFromOffenceList from "../tests/fixtures/helpers/generatePncUpdateDatasetFromOffenceList"
import HO200114 from "./HO200114"

jest.mock("../lib/areAllResultsOnPnc")

const mockedAreAllResultsOnPnc = areAllResultsOnPnc as jest.Mock
mockedAreAllResultsOnPnc.mockReturnValue(true)

describe("HO200114", () => {
  it("generates an exception when clashing sentence deferred and disposal updated operations are generated", () => {
    const pncUpdateDataset = generatePncUpdateDatasetFromOffenceList([
      {
        CourtCaseReferenceNumber: "1",
        CriminalProsecutionReference: { OffenceReasonSequence: "1" },
        Result: [
          { PNCAdjudicationExists: true, PNCDisposalType: 1015, ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT },
          { PNCAdjudicationExists: true, PNCDisposalType: 1015, ResultClass: ResultClass.SENTENCE }
        ]
      }
    ] as Offence[])

    pncUpdateDataset.PncOperations = []

    const exceptions = HO200114(pncUpdateDataset)

    expect(exceptions).toEqual([
      {
        code: "HO200114",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
      }
    ])
  })
})
