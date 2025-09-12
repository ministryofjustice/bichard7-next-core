import type { Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import errorPaths from "@moj-bichard7/common/aho/exceptions/errorPaths"
import ResultClass from "@moj-bichard7/common/types/ResultClass"

import generateFakeAho from "../../phase1/tests/helpers/generateFakeAho"
import areAllPoliceDisposalsWithType from "../lib/areAllPoliceDisposalsWithType"
import areAllResultsOnPnc from "../lib/areAllResultsOnPnc"
import hasUnmatchedPoliceOffences from "../lib/hasUnmatchedPoliceOffences"
import generateAhoFromOffenceList from "../tests/fixtures/helpers/generateAhoFromOffenceList"
import HO200108 from "./HO200108"

jest.mock("../lib/hasUnmatchedPoliceOffences")
jest.mock("../lib/areAllResultsOnPnc")
jest.mock("../lib/areAllPoliceDisposalsWithType")

const mockedHasUnmatchedPoliceOffences = hasUnmatchedPoliceOffences as jest.Mock
const mockedAreAllResultsOnPnc = areAllResultsOnPnc as jest.Mock
const mockedAllPncDisposalsWithType = areAllPoliceDisposalsWithType as jest.Mock

describe("HO200108", () => {
  it("returns a HO200108 exception when ResultClass is JUDGEMENT_WITH_FINAL_RESULT or ADJOURNMENT_WITH_JUDGEMENT, offence and result are recordable, no fixed penalty, no pnc adjudication, doesn't satisfy conditions for exception HO200124, PNCDisposalType is 2060, and RCC check fails", () => {
    mockedHasUnmatchedPoliceOffences.mockReturnValue(false)
    mockedAreAllResultsOnPnc.mockReturnValue(true)
    mockedAllPncDisposalsWithType.mockReturnValue(false)
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
      },
      {
        AddedByTheCourt: false,
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

  it("returns no exceptions when PNC adjudication exists", () => {
    const aho = generateAhoFromOffenceList([
      {
        AddedByTheCourt: false,
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

  it("should not generate a HO200108 exception if HO200124 conditions have been met", () => {
    mockedHasUnmatchedPoliceOffences.mockReturnValue(true)
    mockedAreAllResultsOnPnc.mockReturnValue(false)

    const aho = generateAhoFromOffenceList([
      {
        AddedByTheCourt: false,
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
