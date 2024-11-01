import type { AnnotatedHearingOutcome, Result } from "../../types/AnnotatedHearingOutcome"
import isMatchToPncAdjudicationAndDisposals from "./isMatchToPncAdjudicationAndDisposals"
import type { PncDisposal, PncQueryResult } from "../../types/PncQueryResult"

describe("isMatchToPncAdjudicationAndDisposals", () => {
  const matchingHearingDate = new Date(2024, 3, 1)
  const matchingAho = {
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Hearing: { DateOfHearing: matchingHearingDate },
        Case: {
          HearingDefendant: {
            Offence: [
              {
                CourtCaseReferenceNumber: "1",
                Result: [
                  {
                    PNCDisposalType: 2063,
                    Verdict: "G",
                    PleaStatus: "G",
                    ResultQualifierVariable: [{ Code: "A" }]
                  }
                ],
                CriminalProsecutionReference: { OffenceReasonSequence: "001" }
              }
            ]
          }
        }
      }
    },
    PncQuery: {
      pncId: "1",
      courtCases: [
        {
          courtCaseReference: "1",
          offences: [
            {
              offence: { sequenceNumber: 1 },
              adjudication: {
                verdict: "GUILTY",
                plea: "GUILTY",
                sentenceDate: matchingHearingDate,
                offenceTICNumber: 0,
                weedFlag: undefined
              },
              disposals: [
                {
                  qtyDate: "",
                  qtyDuration: "",
                  type: 2063,
                  qtyUnitsFined: "",
                  qtyMonetaryValue: "",
                  qualifiers: "A",
                  text: ""
                }
              ]
            }
          ]
        }
      ]
    }
  } as AnnotatedHearingOutcome

  it("returns true when no results", () => {
    const aho = structuredClone(matchingAho)
    const offence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]
    offence.Result = []

    const result = isMatchToPncAdjudicationAndDisposals(aho, offence)

    expect(result).toBe(true)
  })

  it("returns true when no offence reason sequence and no recordable results", () => {
    const aho = structuredClone(matchingAho)
    const offence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]
    offence.CriminalProsecutionReference.OffenceReasonSequence = undefined
    offence.Result = [{ PNCDisposalType: 1000 }] as Result[]

    const result = isMatchToPncAdjudicationAndDisposals(aho, offence)

    expect(result).toBe(true)
  })

  it("returns false when no offence reason sequence and recordable results", () => {
    const aho = structuredClone(matchingAho)
    const offence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]
    offence.CriminalProsecutionReference.OffenceReasonSequence = undefined
    offence.Result = [{ PNCDisposalType: 2063 }] as Result[]

    const result = isMatchToPncAdjudicationAndDisposals(aho, offence)

    expect(result).toBe(false)
  })

  it("returns false when no PNC ID", () => {
    const aho = { ...matchingAho, PncQuery: { pncId: undefined } as unknown as PncQueryResult }
    const offence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]

    const result = isMatchToPncAdjudicationAndDisposals(aho, offence)

    expect(result).toBe(false)
  })

  it("returns false when no PNC court cases", () => {
    const aho = structuredClone(matchingAho)
    const offence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]
    aho.PncQuery!.courtCases = []

    const result = isMatchToPncAdjudicationAndDisposals(aho, offence)

    expect(result).toBe(false)
  })

  it("returns true when results match PNC adjudication and disposals", () => {
    const offence = matchingAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]

    const result = isMatchToPncAdjudicationAndDisposals(matchingAho, offence)

    expect(result).toBe(true)
  })

  it("returns false when results match PNC adjudication but not disposals", () => {
    const aho = structuredClone(matchingAho)
    const offence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]
    aho.PncQuery!.courtCases![0].offences[0].disposals = [
      {
        qtyDate: "",
        qtyDuration: "",
        type: 9999,
        qtyUnitsFined: "",
        qtyMonetaryValue: "",
        qualifiers: "A",
        text: ""
      }
    ] as PncDisposal[]

    const result = isMatchToPncAdjudicationAndDisposals(aho, offence)

    expect(result).toBe(false)
  })

  it("returns false when results match PNC disposals but not adjudication", () => {
    const aho = structuredClone(matchingAho)
    const offence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]
    offence.Result[0].Verdict = "NG"

    const result = isMatchToPncAdjudicationAndDisposals(aho, offence)

    expect(result).toBe(false)
  })

  it("checks for exceptions when an offence index and function is provided", () => {
    const checkExceptionFn = jest.fn()
    const offence = matchingAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]

    isMatchToPncAdjudicationAndDisposals(matchingAho, offence, 0, checkExceptionFn)

    expect(checkExceptionFn).toHaveBeenCalled()
  })
})
