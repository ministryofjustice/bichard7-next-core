import HO200124 from "./HO200124"
import errorPaths from "../../lib/exceptions/errorPaths"
import generateAhoFromOffenceList from "../tests/fixtures/helpers/generateAhoFromOffenceList"
import type { Offence } from "../../types/AnnotatedHearingOutcome"
import ResultClass from "../../types/ResultClass"
import generateFakeAho from "../../phase1/tests/helpers/generateFakeAho"
import hasUnmatchedPncOffences from "../lib/generateOperations/hasUnmatchedPncOffences"
import { areAllResultsOnPnc } from "../lib/generateOperations/areAllResultsOnPnc"
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"

jest.mock("../lib/generateOperations/hasUnmatchedPncOffences")
jest.mock("../lib/generateOperations/areAllResultsOnPnc")

const mockedHasUnmatchedPncOffences = hasUnmatchedPncOffences as jest.Mock
const mockedAreAllResultsOnPnc = areAllResultsOnPnc as jest.Mock

describe("HO200124", () => {
  it("returns a HO200124 exception when all conditions are met (no fixed penalty, no PNC adjudication, result class is JUDGEMENT_WITH_FINAL_RESULT, all results are not on PNC, has unmatched offences, and offence not added by court)", () => {
    mockedAreAllResultsOnPnc.mockReturnValue(false)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const aho = generateAhoFromOffenceList([
      {
        AddedByTheCourt: false,
        CourtCaseReferenceNumber: "123456",
        Result: [
          {
            PNCAdjudicationExists: false,
            ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT,
            PNCDisposalType: 9999
          }
        ]
      },
      {
        AddedByTheCourt: false,
        CourtCaseReferenceNumber: "123456",
        Result: [
          {
            PNCAdjudicationExists: false,
            ResultClass: ResultClass.ADJOURNMENT_WITH_JUDGEMENT,
            PNCDisposalType: 9999
          }
        ]
      }
    ] as Offence[])

    const exceptions = HO200124(aho)

    expect(exceptions).toStrictEqual([
      {
        code: ExceptionCode.HO200124,
        path: errorPaths.offence(0).result(0).resultClass
      },
      {
        code: ExceptionCode.HO200124,
        path: errorPaths.offence(1).result(0).resultClass
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
                  CourtCaseReferenceNumber: "123456",
                  Result: [
                    {
                      PNCAdjudicationExists: false,
                      ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT,
                      PNCDisposalType: 9999
                    }
                  ]
                }
              ]
            }
          }
        }
      }
    })

    const exceptions = HO200124(aho)

    expect(exceptions).toStrictEqual([])
  })

  it("returns no exceptions when PNC adjudication exists", () => {
    const aho = generateAhoFromOffenceList([
      {
        AddedByTheCourt: false,
        CourtCaseReferenceNumber: "123456",
        Result: [
          {
            PNCAdjudicationExists: true,
            ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT,
            PNCDisposalType: 9999
          }
        ]
      }
    ] as Offence[])

    const exceptions = HO200124(aho)

    expect(exceptions).toStrictEqual([])
  })

  it("returns no exceptions when ResultClass is not JUDGEMENT_WITH_FINAL_RESULT or", () => {
    const aho = generateAhoFromOffenceList([
      {
        AddedByTheCourt: false,
        Result: [
          {
            PNCAdjudicationExists: false,
            ResultClass: ResultClass.SENTENCE,
            PNCDisposalType: 2060
          }
        ]
      }
    ] as Offence[])

    const exceptions = HO200124(aho)

    expect(exceptions).toStrictEqual([])
  })

  it("returns no exceptions when all results are already on PNC", () => {
    mockedAreAllResultsOnPnc.mockReturnValue(true)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const aho = generateAhoFromOffenceList([
      {
        AddedByTheCourt: false,
        CourtCaseReferenceNumber: "123456",
        Result: [
          {
            PNCAdjudicationExists: false,
            ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT,
            PNCDisposalType: 9999
          }
        ]
      }
    ] as Offence[])

    const exceptions = HO200124(aho)

    expect(exceptions).toStrictEqual([])
  })

  it("returns no exceptions when there are no unmatched PNC offences", () => {
    mockedAreAllResultsOnPnc.mockReturnValue(false)
    mockedHasUnmatchedPncOffences.mockReturnValue(false)

    const aho = generateAhoFromOffenceList([
      {
        AddedByTheCourt: false,
        CourtCaseReferenceNumber: "123456",
        Result: [
          {
            PNCAdjudicationExists: false,
            ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT,
            PNCDisposalType: 9999
          }
        ]
      }
    ] as Offence[])

    const exceptions = HO200124(aho)

    expect(exceptions).toStrictEqual([])
  })

  it("returns no exceptions when the offence is added by the court", () => {
    mockedAreAllResultsOnPnc.mockReturnValue(false)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const aho = generateAhoFromOffenceList([
      {
        AddedByTheCourt: true,
        CourtCaseReferenceNumber: "123456",
        Result: [
          {
            PNCAdjudicationExists: false,
            ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT,
            PNCDisposalType: 9999
          }
        ]
      }
    ] as Offence[])

    const exceptions = HO200124(aho)

    expect(exceptions).toStrictEqual([])
  })
})
