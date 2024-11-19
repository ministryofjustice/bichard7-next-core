import { handleAdjournmentWithJudgement } from "./handleAdjournmentWithJudgement"
import generateResultClassHandlerParams from "../../../tests/helpers/generateResultClassHandlerParams"
import ResultClass from "../../../../types/ResultClass"
import type { Result } from "../../../../types/AnnotatedHearingOutcome"
import { handleJudgementWithFinalResult } from "./handleJudgementWithFinalResult"
import { PncOperation } from "../../../../types/PncOperation"

jest.mock("./handleJudgementWithFinalResult")
const mockedHandleJudgementWithFinalResult = handleJudgementWithFinalResult as jest.Mock

describe("handleAdjournmentWithJudgement", () => {
  it("returns a remand operation with additional operations from judgement with final result", () => {
    mockedHandleJudgementWithFinalResult.mockReturnValue([
      { code: PncOperation.PENALTY_HEARING, data: undefined, status: "NotAttempted" }
    ])
    const params = generateResultClassHandlerParams({
      result: { ResultClass: ResultClass.ADJOURNMENT_WITH_JUDGEMENT } as Result
    })

    const result = handleAdjournmentWithJudgement(params)

    expect(result).toStrictEqual([
      {
        code: PncOperation.PENALTY_HEARING,
        data: undefined,
        status: "NotAttempted"
      },
      {
        code: PncOperation.REMAND,
        courtCaseReference: "234",
        data: undefined,
        isAdjournmentPreJudgement: false,
        status: "NotAttempted"
      }
    ])
  })

  it("returns only a remand operation when no operations generated from judgement with final result", () => {
    mockedHandleJudgementWithFinalResult.mockReturnValue([])
    const params = generateResultClassHandlerParams({
      result: { ResultClass: ResultClass.ADJOURNMENT_WITH_JUDGEMENT } as Result
    })

    const result = handleAdjournmentWithJudgement(params)

    expect(result).toStrictEqual([
      {
        code: PncOperation.REMAND,
        courtCaseReference: "234",
        data: undefined,
        isAdjournmentPreJudgement: false,
        status: "NotAttempted"
      }
    ])
  })
})
