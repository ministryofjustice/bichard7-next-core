import type { AnnotatedHearingOutcome, Offence } from "../../../types/AnnotatedHearingOutcome"
import { PncOperation } from "../../../types/PncOperation"
import ResultClass from "../../../types/ResultClass"
import generateAhoFromOffenceList from "../../tests/fixtures/helpers/generateAhoFromOffenceList"
import generateOperations from "./generateOperations"
import { areAllResultsOnPnc } from "./areAllResultsOnPnc"
import { handleAdjournment } from "./resultClassHandlers/handleAdjournment"
import { handleAdjournmentPostJudgement } from "./resultClassHandlers/handleAdjournmentPostJudgement"
import { handleAdjournmentPreJudgement } from "./resultClassHandlers/handleAdjournmentPreJudgement"
import { handleAdjournmentWithJudgement } from "./resultClassHandlers/handleAdjournmentWithJudgement"
import { handleJudgementWithFinalResult } from "./resultClassHandlers/handleJudgementWithFinalResult"
import { handleSentence } from "./resultClassHandlers/handleSentence"
import EventCode from "@moj-bichard7/common/types/EventCode"

jest.mock("./areAllResultsOnPnc")
jest.mock("./resultClassHandlers/handleAdjournment")
jest.mock("./resultClassHandlers/handleAdjournmentPostJudgement")
jest.mock("./resultClassHandlers/handleAdjournmentPreJudgement")
jest.mock("./resultClassHandlers/handleAdjournmentWithJudgement")
jest.mock("./resultClassHandlers/handleJudgementWithFinalResult")
jest.mock("./resultClassHandlers/handleSentence")

const mockedAreAllResultsOnPnc = areAllResultsOnPnc as jest.Mock
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
    ].forEach((fn) => fn.mockReturnValue({ operations: [], exceptions: [] }))
  })

  it.each([
    { resultClass: ResultClass.ADJOURNMENT, resultClassHandler: mockedHandleAdjournment },
    { resultClass: ResultClass.ADJOURNMENT_POST_JUDGEMENT, resultClassHandler: mockedHandleAdjournmentPostJudgement },
    { resultClass: ResultClass.ADJOURNMENT_PRE_JUDGEMENT, resultClassHandler: mockedHandleAdjournmentPreJudgement },
    { resultClass: ResultClass.ADJOURNMENT_WITH_JUDGEMENT, resultClassHandler: mockedHandleAdjournmentWithJudgement },
    { resultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT, resultClassHandler: mockedHandleJudgementWithFinalResult },
    { resultClass: ResultClass.SENTENCE, resultClassHandler: mockedHandleSentence }
  ])("calls $resultClassHandler when offence result class is $resultClass", ({ resultClass, resultClassHandler }) => {
    mockedAreAllResultsOnPnc.mockReturnValue(false)
    const aho = generateAhoFromOffenceList([
      {
        Result: [{ ResultClass: resultClass, PNCDisposalType: 1001 }]
      }
    ] as Offence[])
    resultClassHandler.mockReturnValue({
      operations: [
        {
          code: PncOperation.REMAND,
          data: { courtCaseReference: "1", isAdjournmentPreJudgement: true },
          status: "NotAttempted"
        }
      ],
      exceptions: []
    })

    const { operations } = generateOperations(aho, resubmitted)

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
      allResultsAlreadyOnPnc: false,
      offence: { Result: [{ PNCDisposalType: 1001, ResultClass: resultClass }] },
      offenceIndex: 0,
      resubmitted: false,
      result: { PNCDisposalType: 1001, ResultClass: resultClass },
      resultIndex: 0
    })
  })

  it("generates no operations for Unresulted result class", () => {
    mockedAreAllResultsOnPnc.mockReturnValue(false)
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

    const { operations } = generateOperations(aho, resubmitted)

    expect(operations).toStrictEqual([])
  })

  it("generates disposal operation when offence added by the Court disposal ccrId matches remand ccrId", () => {
    mockedAreAllResultsOnPnc.mockReturnValue(false)
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

    mockedHandleAdjournment.mockReturnValue({
      operations: [
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
      ],
      exceptions: []
    })

    const { operations } = generateOperations(aho, resubmitted)

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

  it("generates HO200121 exception when there are no recordable offences", () => {
    mockedAreAllResultsOnPnc.mockReturnValue(false)
    const aho = {
      Exceptions: [],
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            HearingDefendant: {
              Offence: [
                {
                  OffenceCategory: "B7",
                  Result: [{ ResultClass: ResultClass.ADJOURNMENT, PNCDisposalType: 1000 }]
                }
              ]
            }
          }
        }
      }
    } as unknown as AnnotatedHearingOutcome

    const { operations, exceptions } = generateOperations(aho, resubmitted)

    expect(operations).toHaveLength(0)
    expect(exceptions).toStrictEqual([
      {
        code: "HO200121",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
      }
    ])
  })

  it("validates generated operations", () => {
    mockedAreAllResultsOnPnc.mockReturnValue(false)
    const aho = {
      Exceptions: [],
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            HearingDefendant: {
              Offence: [
                {
                  Result: [
                    { ResultClass: ResultClass.SENTENCE, PNCDisposalType: 1001 },
                    { ResultClass: ResultClass.ADJOURNMENT_PRE_JUDGEMENT, PNCDisposalType: 1001 }
                  ]
                }
              ]
            }
          }
        }
      }
    } as unknown as AnnotatedHearingOutcome

    mockedHandleSentence.mockReturnValue({ operations: [{ code: PncOperation.SENTENCE_DEFERRED }], exceptions: [] })
    mockedHandleAdjournmentPreJudgement.mockReturnValue({ operations: [{ code: PncOperation.REMAND }], exceptions: [] })

    const { operations, exceptions } = generateOperations(aho, resubmitted)

    expect(operations).toHaveLength(0)
    expect(exceptions).toStrictEqual([
      {
        code: "HO200113",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
      }
    ])
  })

  it("returns exceptions from checking all results are already on PNC with validation exceptions", () => {
    mockedAreAllResultsOnPnc.mockReturnValue(false)
    const resubmitted = false
    const aho = {
      Exceptions: [],
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            HearingDefendant: {
              Offence: [
                {
                  Result: [{ ResultClass: ResultClass.SENTENCE, PNCDisposalType: 1001 }]
                }
              ]
            }
          }
        }
      }
    } as unknown as AnnotatedHearingOutcome

    mockedHandleSentence.mockReturnValue({
      operations: [],
      exceptions: [
        {
          code: "HO200106",
          path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "Offence", 0, "Result", 0]
        }
      ]
    })

    const { operations, exceptions } = generateOperations(aho, resubmitted)

    expect(operations).toHaveLength(0)
    expect(exceptions).toStrictEqual([
      {
        code: "HO200106",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "Offence", 0, "Result", 0]
      }
    ])
  })

  it("returns exceptions from checking all results are already on PNC without validation exceptions when there are none", () => {
    mockedAreAllResultsOnPnc.mockReturnValue(false)
    const aho = {
      Exceptions: [],
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            HearingDefendant: {
              Offence: [
                {
                  Result: [{ ResultClass: ResultClass.SENTENCE, PNCDisposalType: 1001 }]
                }
              ]
            }
          }
        }
      }
    } as unknown as AnnotatedHearingOutcome

    const { operations, exceptions } = generateOperations(aho, resubmitted)

    expect(operations).toHaveLength(0)
    expect(exceptions).toHaveLength(0)
  })

  it("returns only remand operations when all results already on PNC", () => {
    mockedAreAllResultsOnPnc.mockReturnValue(true)
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

    mockedHandleSentence.mockReturnValue({ operations: [{ code: PncOperation.PENALTY_HEARING }], exceptions: [] })
    mockedHandleAdjournment.mockReturnValue({ operations: [{ code: PncOperation.REMAND }], exceptions: [] })

    const { operations } = generateOperations(aho, resubmitted)

    expect(operations).toStrictEqual([{ code: PncOperation.REMAND }])
  })

  it("returns ignored event when all results already on PNC", () => {
    mockedAreAllResultsOnPnc.mockReturnValue(true)
    const aho = {
      Exceptions: [],
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            PenaltyNoticeCaseReferenceNumber: "12345",
            HearingDefendant: {
              Offence: [
                {
                  Result: [{ ResultClass: ResultClass.SENTENCE, PNCDisposalType: 1001 }]
                }
              ]
            }
          }
        }
      }
    } as unknown as AnnotatedHearingOutcome

    const { events } = generateOperations(aho, resubmitted)

    expect(events).toStrictEqual([EventCode.IgnoredAlreadyOnPNC])
  })
})
