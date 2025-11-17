import type { Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import ResultClass from "@moj-bichard7/common/types/ResultClass"

import areAllResultsInPoliceCourtCase from "../lib/areAllResultsInPoliceCourtCase"
import generatePncUpdateDatasetFromOffenceList from "../tests/fixtures/helpers/generatePncUpdateDatasetFromOffenceList"
import HO200114 from "./HO200114"

jest.mock("../lib/areAllResultsInPoliceCourtCase")

const mockedAreAllResultsOnPnc = areAllResultsInPoliceCourtCase as jest.Mock
mockedAreAllResultsOnPnc.mockReturnValue(true)

describe("HO200114", () => {
  it("generates an exception when clashing sentence deferred and disposal updated operations are generated", () => {
    const pncUpdateDataset = generatePncUpdateDatasetFromOffenceList([
      {
        CourtCaseReferenceNumber: "1",
        CriminalProsecutionReference: { OffenceReasonSequence: "1" },
        Result: [
          { ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT, PNCDisposalType: 1015, PNCAdjudicationExists: true },
          { ResultClass: ResultClass.SENTENCE, PNCDisposalType: 1015, PNCAdjudicationExists: true }
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
