import generateAhoFromOffenceList from "../tests/fixtures/helpers/generateAhoFromOffenceList"
import ResultClass from "../../types/ResultClass"
import type { Offence } from "../../types/AnnotatedHearingOutcome"
import HO200113 from "./HO200113"

describe("HO200113", () => {
  it("generates an exception when sentence deferred and remand operations generated with no remand CCRs", () => {
    const aho = generateAhoFromOffenceList([
      {
        CriminalProsecutionReference: {},
        Result: [
          { ResultClass: ResultClass.ADJOURNMENT_PRE_JUDGEMENT, PNCDisposalType: 1015 },
          { ResultClass: ResultClass.SENTENCE, PNCDisposalType: 1015, PNCAdjudicationExists: true }
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
        CriminalProsecutionReference: {},
        CourtCaseReferenceNumber: "1",
        Result: [
          { ResultClass: ResultClass.ADJOURNMENT_POST_JUDGEMENT, PNCDisposalType: 1015, PNCAdjudicationExists: true },
          { ResultClass: ResultClass.SENTENCE, PNCDisposalType: 1015, PNCAdjudicationExists: true }
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
        CriminalProsecutionReference: {},
        CourtCaseReferenceNumber: "1",
        Result: [
          { ResultClass: ResultClass.ADJOURNMENT_POST_JUDGEMENT, PNCDisposalType: 1015, PNCAdjudicationExists: true }
        ]
      },
      {
        CriminalProsecutionReference: {},
        CourtCaseReferenceNumber: "2",
        Result: [{ ResultClass: ResultClass.SENTENCE, PNCDisposalType: 1015, PNCAdjudicationExists: true }]
      }
    ] as Offence[])

    const exceptions = HO200113(aho)

    expect(exceptions).toHaveLength(0)
  })

  it("doesn't generate an exception when only sentence deferred operation generated", () => {
    const aho = generateAhoFromOffenceList([
      {
        CriminalProsecutionReference: {},
        Result: [{ ResultClass: ResultClass.SENTENCE, PNCDisposalType: 1015, PNCAdjudicationExists: true }]
      }
    ] as Offence[])

    const exceptions = HO200113(aho)

    expect(exceptions).toHaveLength(0)
  })
})
