import ResultClass from "@moj-bichard7/common/types/ResultClass"

import type { Offence } from "../../types/AnnotatedHearingOutcome"
import type { PncQueryResult } from "../../types/PncQueryResult"

import areAllResultsOnPnc from "../lib/areAllResultsOnPnc"
import generateAhoFromOffenceList from "../tests/fixtures/helpers/generateAhoFromOffenceList"
import HO200115 from "./HO200115"

jest.mock("../lib/areAllResultsOnPnc")

const mockedAreAllResultsOnPnc = areAllResultsOnPnc as jest.Mock
mockedAreAllResultsOnPnc.mockReturnValue(true)

describe("HO200115", () => {
  it("generates an exception when clashing disposal and disposal updated operations are generated", () => {
    const aho = generateAhoFromOffenceList([
      {
        CourtCaseReferenceNumber: "1",
        CriminalProsecutionReference: { OffenceReasonSequence: "1" },
        Result: [
          { ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT, PNCDisposalType: 1015, PNCAdjudicationExists: false },
          { ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT, PNCDisposalType: 1015, PNCAdjudicationExists: true }
        ]
      }
    ] as Offence[])

    aho.PncQuery = {
      courtCases: [{ courtCaseReference: "1", offences: [{ disposals: [{ type: 2007 }] }] }]
    } as PncQueryResult

    const exceptions = HO200115(aho)

    expect(exceptions).toEqual([
      {
        code: "HO200115",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
      }
    ])
  })
})
