import type { Offence } from "../../types/AnnotatedHearingOutcome"

import ResultClass from "../../types/ResultClass"
import generateAhoFromOffenceList from "../tests/fixtures/helpers/generateAhoFromOffenceList"
import HO200113 from "./HO200113"

describe("HO200113", () => {
  it("generates an exception when sentence deferred and remand operations generated with no remand CCRs", () => {
    const aho = generateAhoFromOffenceList([
      {
        CriminalProsecutionReference: {},
        Result: [
          { PNCDisposalType: 1015, ResultClass: ResultClass.ADJOURNMENT_PRE_JUDGEMENT },
          { PNCAdjudicationExists: true, PNCDisposalType: 1015, ResultClass: ResultClass.SENTENCE }
        ]
      }
    ] as Offence[])

    const exceptions = HO200113(aho)

    expect(exceptions).toEqual([
      {
        code: "HO200113",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
      }
    ])
  })

  it("generates an exception when sentence deferred generated with remand CCRs contains CCR", () => {
    const aho = generateAhoFromOffenceList([
      {
        CourtCaseReferenceNumber: "1",
        CriminalProsecutionReference: {},
        Result: [
          { PNCAdjudicationExists: true, PNCDisposalType: 1015, ResultClass: ResultClass.ADJOURNMENT_POST_JUDGEMENT },
          { PNCAdjudicationExists: true, PNCDisposalType: 1015, ResultClass: ResultClass.SENTENCE }
        ]
      }
    ] as Offence[])

    const exceptions = HO200113(aho)

    expect(exceptions).toEqual([
      {
        code: "HO200113",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
      }
    ])
  })

  it("doesn't generate an exception when sentence deferred operation generated and remand CCRs doesn't contain its CCR", () => {
    const aho = generateAhoFromOffenceList([
      {
        CourtCaseReferenceNumber: "1",
        CriminalProsecutionReference: {},
        Result: [
          { PNCAdjudicationExists: true, PNCDisposalType: 1015, ResultClass: ResultClass.ADJOURNMENT_POST_JUDGEMENT }
        ]
      },
      {
        CourtCaseReferenceNumber: "2",
        CriminalProsecutionReference: {},
        Result: [{ PNCAdjudicationExists: true, PNCDisposalType: 1015, ResultClass: ResultClass.SENTENCE }]
      }
    ] as Offence[])

    const exceptions = HO200113(aho)

    expect(exceptions).toHaveLength(0)
  })

  it("doesn't generate an exception when only sentence deferred operation generated", () => {
    const aho = generateAhoFromOffenceList([
      {
        CriminalProsecutionReference: {},
        Result: [{ PNCAdjudicationExists: true, PNCDisposalType: 1015, ResultClass: ResultClass.SENTENCE }]
      }
    ] as Offence[])

    const exceptions = HO200113(aho)

    expect(exceptions).toHaveLength(0)
  })
})
