import HO200108 from "./HO200108"
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../lib/exceptions/errorPaths"
import generateAhoFromOffenceList from "../tests/fixtures/helpers/generateAhoFromOffenceList"
import type { Offence } from "../../types/AnnotatedHearingOutcome"
import ResultClass from "../../types/ResultClass"
import generateFakeAho from "../../phase1/tests/helpers/generateFakeAho"
import hasUnmatchedPncOffences from "../lib/generateOperations/hasUnmatchedPncOffences"
import { areAllResultsOnPnc } from "../lib/generateOperations/areAllResultsOnPnc"
import areAllPncResults2007 from "../lib/areAllPncResults2007"

jest.mock("../lib/generateOperations/hasUnmatchedPncOffences")
jest.mock("../lib/generateOperations/areAllResultsOnPnc")
jest.mock("../lib/areAllPncResults2007")

const mockedHasUnmatchedPncOffences = hasUnmatchedPncOffences as jest.Mock
const mockedAreAllResultsOnPnc = areAllResultsOnPnc as jest.Mock
const mockedAreAllPncResults2007 = areAllPncResults2007 as jest.Mock

describe("HO200108", () => {
  mockedHasUnmatchedPncOffences.mockReturnValue(false)
  mockedAreAllResultsOnPnc.mockReturnValue(true)
  mockedAreAllPncResults2007.mockReturnValue(false)

  it("returns a HO200108 exception when ResultClass is JUDGEMENT_WITH_FINAL_RESULT or ADJOURNMENT_WITH_JUDGEMENT, offence and result are recordable, no fixed penalty, no pnc adjudication, doesn't satisfy conditions for exception HO200124, PNCDisposalType is 2060, and RCC check fails", () => {
    const aho = generateAhoFromOffenceList([
      {
        AddedByTheCourt: false,
        CourtCaseReferenceNumber: "12345",
        Result: [
          {
            PNCAdjudicationExists: false,
            ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT,
            PNCDisposalType: 2060
          }
        ]
      },
      {
        AddedByTheCourt: false,
        CourtCaseReferenceNumber: "12345",
        Result: [
          {
            PNCAdjudicationExists: false,
            ResultClass: ResultClass.ADJOURNMENT_WITH_JUDGEMENT,
            PNCDisposalType: 2060
          }
        ]
      }
    ] as Offence[])

    const exceptions = HO200108(aho)

    expect(exceptions).toStrictEqual([
      {
        code: ExceptionCode.HO200108,
        path: errorPaths.offence(0).result(0).resultClass
      },
      {
        code: ExceptionCode.HO200108,
        path: errorPaths.offence(1).result(0).resultClass
      }
    ])
  })

  it("returns no exceptions when there's no courtCaseReferenceNumber", () => {
    const aho = generateAhoFromOffenceList([
      {
        AddedByTheCourt: false,
        Result: [
          {
            PNCAdjudicationExists: false,
            ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT,
            PNCDisposalType: 2060
          }
        ]
      }
    ] as Offence[])

    const exceptions = HO200108(aho)

    expect(exceptions).toStrictEqual([])
  })

  it("returns no exceptions when PNC adjudication exists", () => {
    const aho = generateAhoFromOffenceList([
      {
        AddedByTheCourt: false,
        CourtCaseReferenceNumber: "12345",
        Result: [
          {
            PNCAdjudicationExists: true,
            ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT,
            PNCDisposalType: 2060
          }
        ]
      }
    ] as Offence[])

    const exceptions = HO200108(aho)

    expect(exceptions).toStrictEqual([])
  })

  it("returns no exceptions when ResultClass is not JUDGEMENT_WITH_FINAL_RESULT or ADJOURNMENT_WITH_JUDGEMENT", () => {
    const aho = generateAhoFromOffenceList([
      {
        AddedByTheCourt: false,
        CourtCaseReferenceNumber: "12345",
        Result: [
          {
            PNCAdjudicationExists: false,
            ResultClass: ResultClass.SENTENCE,
            PNCDisposalType: 2060
          }
        ]
      }
    ] as Offence[])

    const exceptions = HO200108(aho)

    expect(exceptions).toStrictEqual([])
  })

  it("returns no exceptions when the offence is added by the court", () => {
    const aho = generateAhoFromOffenceList([
      {
        AddedByTheCourt: true,
        CourtCaseReferenceNumber: "12345",
        Result: [
          {
            PNCAdjudicationExists: false,
            ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT,
            PNCDisposalType: 2060
          }
        ]
      }
    ] as Offence[])

    const exceptions = HO200108(aho)

    expect(exceptions).toStrictEqual([])
  })

  it("returns no exceptions when PNCDisposalType is not 2060", () => {
    const aho = generateAhoFromOffenceList([
      {
        AddedByTheCourt: false,
        CourtCaseReferenceNumber: "12345",
        Result: [
          {
            PNCAdjudicationExists: false,
            ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT,
            PNCDisposalType: 9999
          }
        ]
      }
    ] as Offence[])

    const exceptions = HO200108(aho)

    expect(exceptions).toStrictEqual([])
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
                      ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT,
                      PNCDisposalType: 2060
                    }
                  ]
                }
              ]
            }
          }
        }
      }
    })

    const exceptions = HO200108(aho)

    expect(exceptions).toStrictEqual([])
  })
})
