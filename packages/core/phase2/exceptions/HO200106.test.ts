import HO200106 from "./HO200106"
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../lib/exceptions/errorPaths"
import generateAhoFromOffenceList from "../tests/fixtures/helpers/generateAhoFromOffenceList"
import type { Offence } from "../../types/AnnotatedHearingOutcome"
import ResultClass from "../../types/ResultClass"
import generateFakeAho from "../../phase1/tests/helpers/generateFakeAho"

describe("HO200106", () => {
  it("returns a HO200106 exception where its not a fixed penalty, offence and result are recorable, result class is Sentence, no PNC adjudications on the result and the offence is not added by the court", () => {
    const aho = generateAhoFromOffenceList([
      {
        AddedByTheCourt: false,
        Result: [
          {
            PNCAdjudicationExists: false,
            ResultClass: ResultClass.SENTENCE,
            PNCDisposalType: 1001
          },
          {
            PNCAdjudicationExists: true
          }
        ]
      },
      {
        AddedByTheCourt: true,
        Result: [
          {
            PNCAdjudicationExists: true
          },
          {
            PNCAdjudicationExists: false
          }
        ]
      },
      {
        AddedByTheCourt: false,
        Result: [
          {
            PNCAdjudicationExists: true
          },
          {
            PNCAdjudicationExists: false,
            ResultClass: ResultClass.SENTENCE,
            PNCDisposalType: 1001
          }
        ]
      }
    ] as Offence[])

    const exceptions = HO200106(aho)

    expect(exceptions).toStrictEqual([
      {
        code: ExceptionCode.HO200106,
        path: errorPaths.offence(0).result(0).resultClass
      },
      {
        code: ExceptionCode.HO200106,
        path: errorPaths.offence(2).result(1).resultClass
      }
    ])
  })

  it("returns no exceptions when there is a fixed penalty", () => {
    const aho = generateFakeAho({
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            PenaltyNoticeCaseReferenceNumber: "XXXXXX",
            HearingDefendant: {
              Offence: [
                {
                  AddedByTheCourt: false,
                  Result: [
                    {
                      PNCAdjudicationExists: false,
                      ResultClass: ResultClass.SENTENCE,
                      PNCDisposalType: 1001
                    }
                  ]
                }
              ]
            }
          }
        }
      }
    })

    const exceptions = HO200106(aho)

    expect(exceptions).toStrictEqual([])
  })

  it("returns no exceptions when PNC adjudication exists", () => {
    const aho = generateAhoFromOffenceList([
      {
        AddedByTheCourt: false,
        Result: [
          {
            PNCAdjudicationExists: true,
            ResultClass: ResultClass.SENTENCE,
            PNCDisposalType: 1001
          }
        ]
      }
    ] as Offence[])

    const exceptions = HO200106(aho)

    expect(exceptions).toStrictEqual([])
  })

  it("returns no exceptions when offence is added by the court", () => {
    const aho = generateAhoFromOffenceList([
      {
        AddedByTheCourt: true,
        Result: [
          {
            PNCAdjudicationExists: false,
            ResultClass: ResultClass.SENTENCE,
            PNCDisposalType: 1001
          }
        ]
      }
    ] as Offence[])

    const exceptions = HO200106(aho)

    expect(exceptions).toStrictEqual([])
  })
})
