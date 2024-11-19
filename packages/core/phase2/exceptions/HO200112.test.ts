import type { Offence } from "../../types/AnnotatedHearingOutcome"

import ResultClass from "../../types/ResultClass"
import areAllResultsOnPnc from "../lib/areAllResultsOnPnc"
import generateAhoFromOffenceList from "../tests/fixtures/helpers/generateAhoFromOffenceList"
import HO200112 from "./HO200112"

jest.mock("../lib/areAllResultsOnPnc")

const mockedAreAllResultsOnPnc = areAllResultsOnPnc as jest.Mock
mockedAreAllResultsOnPnc.mockReturnValue(true)

describe("HO200112", () => {
  it("generates an exception when clashing disposal and sentence deferred operations are generated", () => {
    const aho = generateAhoFromOffenceList([
      {
        CourtCaseReferenceNumber: "1",
        CriminalProsecutionReference: { OffenceReasonSequence: "1" },
        Result: [
          { PNCAdjudicationExists: false, PNCDisposalType: 1015, ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT }
        ]
      },
      {
        CourtCaseReferenceNumber: "1",
        CriminalProsecutionReference: { OffenceReasonSequence: "2" },
        Result: [{ PNCAdjudicationExists: true, PNCDisposalType: 1015, ResultClass: ResultClass.SENTENCE }]
      }
    ] as Offence[])

    const exceptions = HO200112(aho)

    expect(exceptions).toEqual([
      {
        code: "HO200112",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
      }
    ])
  })
})
