import type { AnnotatedHearingOutcome, Offence } from "../../../../types/AnnotatedHearingOutcome"
import { PncOperation } from "../../../../types/PncOperation"
import ResultClass from "../../../../types/ResultClass"
import generateAhoFromOffenceList from "../../../tests/fixtures/helpers/generateAhoFromOffenceList"
import generateOperations from "./generateOperations"
import { areAllResultsAlreadyPresentOnPnc } from "../areAllResultsAlreadyPresentOnPnc"
import { handleAdjournment } from "./resultClassHandlers/handleAdjournment"
import { handleAdjournmentPostJudgement } from "./resultClassHandlers/handleAdjournmentPostJudgement"
import { handleAdjournmentPreJudgement } from "./resultClassHandlers/handleAdjournmentPreJudgement"
import { handleAdjournmentWithJudgement } from "./resultClassHandlers/handleAdjournmentWithJudgement"
import { handleJudgementWithFinalResult } from "./resultClassHandlers/handleJudgementWithFinalResult"
import { handleSentence } from "./resultClassHandlers/handleSentence"

jest.mock("../areAllResultsAlreadyPresentOnPnc")
jest.mock("./resultClassHandlers/handleAdjournment")
jest.mock("./resultClassHandlers/handleAdjournmentPostJudgement")
jest.mock("./resultClassHandlers/handleAdjournmentPreJudgement")
jest.mock("./resultClassHandlers/handleAdjournmentWithJudgement")
jest.mock("./resultClassHandlers/handleJudgementWithFinalResult")
jest.mock("./resultClassHandlers/handleSentence")

const mockedAreAllResultsAlreadyPresentOnPnc = areAllResultsAlreadyPresentOnPnc as jest.Mock
const mockedHandleAdjournment = handleAdjournment as jest.Mock
const mockedHandleAdjournmentPostJudgement = handleAdjournmentPostJudgement as jest.Mock
const mockedHandleAdjournmentPreJudgement = handleAdjournmentPreJudgement as jest.Mock
const mockedHandleAdjournmentWithJudgement = handleAdjournmentWithJudgement as jest.Mock
const mockedHandleJudgementWithFinalResult = handleJudgementWithFinalResult as jest.Mock
const mockedHandleSentence = handleSentence as jest.Mock

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
    ].forEach((fn) => fn.mockImplementation(() => {}))
  })

  it.each([
    { resultClass: ResultClass.ADJOURNMENT, resultClassHandler: mockedHandleAdjournment },
    { resultClass: ResultClass.ADJOURNMENT_POST_JUDGEMENT, resultClassHandler: mockedHandleAdjournmentPostJudgement },
    { resultClass: ResultClass.ADJOURNMENT_PRE_JUDGEMENT, resultClassHandler: mockedHandleAdjournmentPreJudgement },
    { resultClass: ResultClass.ADJOURNMENT_WITH_JUDGEMENT, resultClassHandler: mockedHandleAdjournmentWithJudgement },
    { resultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT, resultClassHandler: mockedHandleJudgementWithFinalResult },
    { resultClass: ResultClass.SENTENCE, resultClassHandler: mockedHandleSentence }
  ])("calls $resultClassHandler when offence result class is $resultClass", ({ resultClass, resultClassHandler }) => {
    mockedAreAllResultsAlreadyPresentOnPnc.mockReturnValue({ value: false, exceptions: [] })
    const resubmitted = false
    const aho = generateAhoFromOffenceList([
      {
        Result: [{ ResultClass: resultClass, PNCDisposalType: 1001 }]
      }
    ] as Offence[])
    resultClassHandler.mockImplementation(() => {
      return {
        operations: [
          {
            code: PncOperation.REMAND,
            data: { courtCaseReference: "1", isAdjournmentPreJudgement: true },
            status: "NotAttempted"
          }
        ],
        exceptions: []
      }
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
    mockedAreAllResultsAlreadyPresentOnPnc.mockReturnValue({ value: false, exceptions: [] })
    const resubmitted = false
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

  it("generates HO200118 exception when there are no operations, no recordable results, and no operation exceptions", () => {
    mockedAreAllResultsAlreadyPresentOnPnc.mockReturnValue({ value: false, exceptions: [] })
    const resubmitted = false
    const aho = {
      Exceptions: [],
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            HearingDefendant: {
              Offence: [
                {
                  Result: [{ ResultClass: ResultClass.ADJOURNMENT, PNCDisposalType: 1000 }]
                }
              ]
            }
          }
        }
      }
    } as unknown as AnnotatedHearingOutcome

    const { exceptions } = generateOperations(aho, resubmitted)

    expect(exceptions).toStrictEqual([
      {
        code: "HO200118",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
      }
    ])
  })

  it("generates disposal operation when offence added by the Court disposal ccrId matches remand ccrId", () => {
    mockedAreAllResultsAlreadyPresentOnPnc.mockReturnValue({ value: false, exceptions: [] })
    const resubmitted = false
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

    mockedHandleAdjournment.mockImplementation(() => {
      return {
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
      }
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
    mockedAreAllResultsAlreadyPresentOnPnc.mockReturnValue({ value: false, exceptions: [] })
    const resubmitted = false
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

  it("generates HO200121 exception when there are no offences", () => {
    mockedAreAllResultsAlreadyPresentOnPnc.mockReturnValue({ value: false, exceptions: [] })
    const resubmitted = false
    const aho = {
      Exceptions: [],
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            HearingDefendant: {
              Offence: []
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
})
