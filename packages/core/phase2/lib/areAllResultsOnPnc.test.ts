import areAllResultsOnPnc from "./areAllResultsOnPnc"
import type { AnnotatedHearingOutcome, Offence } from "../../types/AnnotatedHearingOutcome"

describe("areAllResultsOnPnc", () => {
  const matchingAho = {
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Hearing: { DateOfHearing: new Date(2024, 3, 1) },
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
                sentenceDate: new Date(2024, 3, 1),
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

  it("returns true when all offences match to the PNC adjudication and disposals", () => {
    const result = areAllResultsOnPnc(matchingAho)

    expect(result).toBe(true)
  })

  it("returns false when not all offences match to the PNC adjudication and disposals", () => {
    const aho = structuredClone(matchingAho)
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      matchingAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0],
      {
        CourtCaseReferenceNumber: "2",
        Result: [
          {
            PNCDisposalType: 2063,
            Verdict: "NG",
            PleaStatus: "G",
            ResultQualifierVariable: [{ Code: "A" }]
          }
        ],
        CriminalProsecutionReference: { OffenceReasonSequence: "002" }
      }
    ] as Offence[]

    const result = areAllResultsOnPnc(aho)

    expect(result).toBe(false)
  })
})
