import generateAhoFromOffenceList from "../tests/fixtures/helpers/generateAhoFromOffenceList"
import ResultClass from "../../types/ResultClass"
import type { Offence } from "../../types/AnnotatedHearingOutcome"
import HO200112 from "./HO200112"
import { areAllResultsOnPnc } from "../lib/generateOperations/areAllResultsOnPnc"

jest.mock("../lib/generateOperations/areAllResultsOnPnc")

const mockedAreAllResultsOnPnc = areAllResultsOnPnc as jest.Mock
mockedAreAllResultsOnPnc.mockReturnValue(true)

describe("HO200112", () => {
  it("generates an exception when clashing disposal and sentence deferred operations are generated", () => {
    const aho = generateAhoFromOffenceList([
      {
        CourtCaseReferenceNumber: "1",
        CriminalProsecutionReference: { OffenceReasonSequence: "1" },
        Result: [
          { ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT, PNCDisposalType: 1015, PNCAdjudicationExists: false }
        ]
      },
      {
        CourtCaseReferenceNumber: "1",
        CriminalProsecutionReference: { OffenceReasonSequence: "2" },
        Result: [{ ResultClass: ResultClass.SENTENCE, PNCDisposalType: 1015, PNCAdjudicationExists: true }]
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
