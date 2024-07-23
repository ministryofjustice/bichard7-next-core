import type { AnnotatedHearingOutcome, Offence } from "../../../../types/AnnotatedHearingOutcome"
import ResultClass from "../../../../types/ResultClass"
import generateAhoFromOffenceList from "../../../tests/fixtures/helpers/generateAhoFromOffenceList"
import deriveOperationSequence from "./deriveOperationSequence"
import { handleAdjournment } from "./resultClassHandlers/handleAdjournment"
import { handleAdjournmentPostJudgement } from "./resultClassHandlers/handleAdjournmentPostJudgement"
import { handleAdjournmentPreJudgement } from "./resultClassHandlers/handleAdjournmentPreJudgement"
import { handleAdjournmentWithJudgement } from "./resultClassHandlers/handleAdjournmentWithJudgement"
import { handleAppealOutcome } from "./resultClassHandlers/handleAppealOutcome"
import { handleJudgementWithFinalResult } from "./resultClassHandlers/handleJudgementWithFinalResult"
import { handleSentence } from "./resultClassHandlers/handleSentence"

jest.mock("./resultClassHandlers/handleAdjournment")
jest.mock("./resultClassHandlers/handleAdjournmentPostJudgement")
jest.mock("./resultClassHandlers/handleAdjournmentPreJudgement")
jest.mock("./resultClassHandlers/handleAdjournmentWithJudgement")
jest.mock("./resultClassHandlers/handleAppealOutcome")
jest.mock("./resultClassHandlers/handleJudgementWithFinalResult")
jest.mock("./resultClassHandlers/handleSentence")

const mockedHandleAdjournment = handleAdjournment as jest.Mock
const mockedHandleAdjournmentPostJudgement = handleAdjournmentPostJudgement as jest.Mock
const mockedHandleAdjournmentPreJudgement = handleAdjournmentPreJudgement as jest.Mock
const mockedHandleAdjournmentWithJudgement = handleAdjournmentWithJudgement as jest.Mock
const mockedHandleAppealOutcome = handleAppealOutcome as jest.Mock
const mockedHandleJudgementWithFinalResult = handleJudgementWithFinalResult as jest.Mock
const mockedHandleSentence = handleSentence as jest.Mock

describe("deriveOperationSequence", () => {
  beforeEach(() => {
    jest.resetAllMocks()
    ;[
      mockedHandleAdjournment,
      mockedHandleAdjournmentPostJudgement,
      mockedHandleAdjournmentPreJudgement,
      mockedHandleAdjournmentWithJudgement,
      mockedHandleAppealOutcome,
      mockedHandleJudgementWithFinalResult,
      mockedHandleSentence,
      mockedHandleAdjournmentPreJudgement
    ].forEach((fn) => fn.mockImplementation(() => {}))
  })

  it.each([
    { resultClass: ResultClass.ADJOURNMENT, expectedFn: mockedHandleAdjournment },
    { resultClass: ResultClass.ADJOURNMENT_POST_JUDGEMENT, expectedFn: mockedHandleAdjournmentPostJudgement },
    { resultClass: ResultClass.ADJOURNMENT_PRE_JUDGEMENT, expectedFn: mockedHandleAdjournmentPreJudgement },
    { resultClass: ResultClass.ADJOURNMENT_WITH_JUDGEMENT, expectedFn: mockedHandleAdjournmentWithJudgement },
    { resultClass: ResultClass.APPEAL_OUTCOME, expectedFn: mockedHandleAppealOutcome },
    { resultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT, expectedFn: mockedHandleJudgementWithFinalResult },
    { resultClass: ResultClass.SENTENCE, expectedFn: mockedHandleSentence }
  ])(
    "should call $expectedFn function when result class is $resultClass and offence has value",
    ({ resultClass, expectedFn }) => {
      const allResultAlreadyOnPnc = false
      const resubmitted = false
      const aho = generateAhoFromOffenceList([
        {
          Result: [{ ResultClass: resultClass, PNCDisposalType: 1001 }]
        }
      ] as Offence[])
      expectedFn.mockImplementation(() => {
        return {
          operations: [
            {
              code: "NEWREM",
              data: { courtCaseReference: "1", isAdjournmentPreJudgement: true },
              status: "NotAttempted"
            }
          ],
          exceptions: []
        }
      })

      const operationsResult = deriveOperationSequence(aho, resubmitted, allResultAlreadyOnPnc)

      expect(operationsResult).toStrictEqual({
        operations: [
          {
            code: "NEWREM",
            data: { courtCaseReference: "1", isAdjournmentPreJudgement: true },
            status: "NotAttempted"
          }
        ]
      })
      expect(expectedFn).toHaveBeenCalledTimes(1)
      expect(expectedFn.mock.calls[0][0]).toStrictEqual({
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
    }
  )

  it("should ignore Unresulted result class", () => {
    const allResultAlreadyOnPnc = false
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

    const operationsResult = deriveOperationSequence(aho, resubmitted, allResultAlreadyOnPnc)

    expect(operationsResult).toStrictEqual({ operations: [] })
  })

  it("should generate exception HO200118 when there are no operations, no recordable results, and there are no exceptions", () => {
    const allResultAlreadyOnPnc = false
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

    const operationsResult = deriveOperationSequence(aho, resubmitted, allResultAlreadyOnPnc)

    expect(operationsResult).toStrictEqual({
      exceptions: [
        {
          code: "HO200118",
          path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
        }
      ]
    })
  })

  it("should return OAAC DISARR operation when OAAC DISARR ccrId matches remand ccrId", () => {
    const allResultAlreadyOnPnc = false
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
            code: "NEWREM",
            data: { courtCaseReference: "1", isAdjournmentPreJudgement: true },
            status: "NotAttempted"
          },
          { code: "DISARR", data: { courtCaseReference: "1" }, addedByTheCourt: true, status: "NotAttempted" }
        ],
        exceptions: []
      }
    })

    const operationsResult = deriveOperationSequence(aho, resubmitted, allResultAlreadyOnPnc)

    expect(operationsResult).toStrictEqual({
      operations: [
        { code: "NEWREM", data: { courtCaseReference: "1", isAdjournmentPreJudgement: true }, status: "NotAttempted" },
        { code: "DISARR", data: { courtCaseReference: "1" }, status: "NotAttempted" }
      ]
    })
  })

  it("should generate exception HO200121 when there are no recordable offences", () => {
    const allResultAlreadyOnPnc = false
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

    const operationsResult = deriveOperationSequence(aho, resubmitted, allResultAlreadyOnPnc)

    expect(operationsResult).toStrictEqual({
      exceptions: [
        {
          code: "HO200121",
          path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
        }
      ]
    })
  })

  it("should generate exception HO200121 when there are no offences", () => {
    const allResultAlreadyOnPnc = false
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

    const operationsResult = deriveOperationSequence(aho, resubmitted, allResultAlreadyOnPnc)

    expect(operationsResult).toStrictEqual({
      exceptions: [
        {
          code: "HO200121",
          path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
        }
      ]
    })
  })
})
