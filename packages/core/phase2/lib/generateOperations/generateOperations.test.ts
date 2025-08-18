import ResultClass from "@moj-bichard7/common/types/ResultClass"

import type { AnnotatedHearingOutcome, Offence } from "../../../types/AnnotatedHearingOutcome"

import { PncOperation } from "../../../types/PncOperation"
import generateAhoFromOffenceList from "../../tests/fixtures/helpers/generateAhoFromOffenceList"
import generateOperations from "./generateOperations"
import { handleAdjournment } from "./resultClassHandlers/handleAdjournment"
import { handleAdjournmentPostJudgement } from "./resultClassHandlers/handleAdjournmentPostJudgement"
import { handleAdjournmentPreJudgement } from "./resultClassHandlers/handleAdjournmentPreJudgement"
import { handleAdjournmentWithJudgement } from "./resultClassHandlers/handleAdjournmentWithJudgement"
import { handleJudgementWithFinalResult } from "./resultClassHandlers/handleJudgementWithFinalResult"
import { handleSentence } from "./resultClassHandlers/handleSentence"

jest.mock("./resultClassHandlers/handleAdjournment")
jest.mock("./resultClassHandlers/handleAdjournmentPostJudgement")
jest.mock("./resultClassHandlers/handleAdjournmentPreJudgement")
jest.mock("./resultClassHandlers/handleAdjournmentWithJudgement")
jest.mock("./resultClassHandlers/handleJudgementWithFinalResult")
jest.mock("./resultClassHandlers/handleSentence")

const mockedHandleAdjournment = handleAdjournment as jest.Mock
const mockedHandleAdjournmentPostJudgement = handleAdjournmentPostJudgement as jest.Mock
const mockedHandleAdjournmentPreJudgement = handleAdjournmentPreJudgement as jest.Mock
const mockedHandleAdjournmentWithJudgement = handleAdjournmentWithJudgement as jest.Mock
const mockedHandleJudgementWithFinalResult = handleJudgementWithFinalResult as jest.Mock
const mockedHandleSentence = handleSentence as jest.Mock

const resubmitted = false

describe("generateOperations", () => {
  beforeEach(() => {
    jest.resetAllMocks()
    ;[
      mockedHandleAdjournment,
      mockedHandleAdjournmentPostJudgement,
      mockedHandleAdjournmentPreJudgement,
      mockedHandleAdjournmentWithJudgement,
      mockedHandleJudgementWithFinalResult,
      mockedHandleSentence,
      mockedHandleAdjournmentPreJudgement
    ].forEach((fn) => fn.mockReturnValue([]))
  })

  it.each([
    { resultClass: ResultClass.ADJOURNMENT, resultClassHandler: mockedHandleAdjournment },
    { resultClass: ResultClass.ADJOURNMENT_POST_JUDGEMENT, resultClassHandler: mockedHandleAdjournmentPostJudgement },
    { resultClass: ResultClass.ADJOURNMENT_PRE_JUDGEMENT, resultClassHandler: mockedHandleAdjournmentPreJudgement },
    { resultClass: ResultClass.ADJOURNMENT_WITH_JUDGEMENT, resultClassHandler: mockedHandleAdjournmentWithJudgement },
    { resultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT, resultClassHandler: mockedHandleJudgementWithFinalResult },
    { resultClass: ResultClass.SENTENCE, resultClassHandler: mockedHandleSentence }
  ])("calls $resultClassHandler when offence result class is $resultClass", ({ resultClass, resultClassHandler }) => {
    const areAllResultsOnPnc = false
    const aho = generateAhoFromOffenceList([
      {
        Result: [{ ResultClass: resultClass, PNCDisposalType: 1001 }]
      }
    ] as Offence[])
    resultClassHandler.mockReturnValue([
      {
        code: PncOperation.REMAND,
        data: { courtCaseReference: "1", isAdjournmentPreJudgement: true },
        status: "NotAttempted"
      }
    ])

    const operations = generateOperations(aho, resubmitted, areAllResultsOnPnc)

    expect(operations).toStrictEqual([
      {
        code: PncOperation.REMAND,
        data: { courtCaseReference: "1", isAdjournmentPreJudgement: true },
        status: "NotAttempted"
      }
    ])
    expect(resultClassHandler).toHaveBeenCalledTimes(1)
    expect(resultClassHandler.mock.calls[0][0]).toStrictEqual({
      aho: {
        AnnotatedHearingOutcome: {
          HearingOutcome: {
            Case: {
              HearingDefendant: {
                Offence: [{ Result: [{ PNCDisposalType: 1001, ResultClass: resultClass }] }]
              }
            }
          }
        },
        Exceptions: []
      },
      areAllResultsOnPnc: false,
      offence: { Result: [{ PNCDisposalType: 1001, ResultClass: resultClass }] },
      resubmitted: false,
      result: { PNCDisposalType: 1001, ResultClass: resultClass }
    })
  })

  it("generates no operations for Unresulted result class", () => {
    const areAllResultsOnPnc = false
    const aho = {
      Exceptions: [],
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            HearingDefendant: {
              Offence: [
                {
                  Result: [{ ResultClass: ResultClass.UNRESULTED, PNCDisposalType: 1001 }]
                }
              ]
            }
          }
        }
      }
    } as unknown as AnnotatedHearingOutcome

    const operations = generateOperations(aho, resubmitted, areAllResultsOnPnc)

    expect(operations).toStrictEqual([])
  })

  it("generates disposal operation when court case reference in offence added by the Court disposal matches court case reference in remand", () => {
    const areAllResultsOnPnc = false
    const aho = {
      Exceptions: [],
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            HearingDefendant: {
              Offence: [
                {
                  Result: [{ ResultClass: ResultClass.ADJOURNMENT, PNCDisposalType: 1001 }]
                }
              ]
            }
          }
        }
      }
    } as unknown as AnnotatedHearingOutcome

    mockedHandleAdjournment.mockReturnValue([
      {
        code: PncOperation.REMAND,
        data: undefined,
        courtCaseReference: "1",
        isAdjournmentPreJudgement: true,
        status: "NotAttempted"
      },
      {
        code: PncOperation.NORMAL_DISPOSAL,
        data: { courtCaseReference: "1" },
        addedByTheCourt: true,
        status: "NotAttempted"
      }
    ])

    const operations = generateOperations(aho, resubmitted, areAllResultsOnPnc)

    expect(operations).toStrictEqual([
      {
        code: PncOperation.NORMAL_DISPOSAL,
        data: { courtCaseReference: "1" },
        addedByTheCourt: true,
        status: "NotAttempted"
      },
      {
        code: PncOperation.REMAND,
        data: undefined,
        courtCaseReference: "1",
        isAdjournmentPreJudgement: true,
        status: "NotAttempted"
      }
    ])
  })

  it("returns no operations when there are no recordable offences", () => {
    const areAllResultsOnPnc = false
    const aho = {
      Exceptions: [],
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            HearingDefendant: {
              Offence: [
                {
                  offenceCategory: "B7",
                  Result: [{}]
                }
              ]
            }
          }
        }
      }
    } as unknown as AnnotatedHearingOutcome

    const operations = generateOperations(aho, resubmitted, areAllResultsOnPnc)

    expect(operations).toHaveLength(0)
  })

  it("returns only remand operations when all results already on PNC", () => {
    const areAllResultsOnPnc = true
    const aho = {
      Exceptions: [],
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            PenaltyNoticeCaseReferenceNumber: "12345",
            HearingDefendant: {
              Offence: [
                {
                  Result: [
                    { ResultClass: ResultClass.SENTENCE, PNCDisposalType: 1001 },
                    { ResultClass: ResultClass.ADJOURNMENT, PNCDisposalType: 1001 }
                  ]
                }
              ]
            }
          }
        }
      }
    } as unknown as AnnotatedHearingOutcome

    mockedHandleSentence.mockReturnValue([{ code: PncOperation.PENALTY_HEARING }])
    mockedHandleAdjournment.mockReturnValue([{ code: PncOperation.REMAND }])

    const operations = generateOperations(aho, resubmitted, areAllResultsOnPnc)

    expect(operations).toStrictEqual([{ code: PncOperation.REMAND }])
  })
})
