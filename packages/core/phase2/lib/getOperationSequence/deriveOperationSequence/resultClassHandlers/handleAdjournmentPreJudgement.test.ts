import generateResultClassHandlerParams from "../../../../tests/helpers/generateResultClassHandlerParams"
import addRemandOperation from "../../../addRemandOperation"
import { handleAdjournmentPreJudgement } from "./handleAdjournmentPreJudgement"
import type { Result } from "../../../../../types/AnnotatedHearingOutcome"

jest.mock("../../../addRemandOperation")
;(addRemandOperation as jest.Mock).mockImplementation(() => {})

describe("handleAdjournmentPreJudgement", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("should generate exception HO200100 when adjudication exists", () => {
    const params = generateResultClassHandlerParams({ result: { PNCAdjudicationExists: true } as Result })

    const exception = handleAdjournmentPreJudgement(params)

    expect(exception).toStrictEqual({
      code: "HO200100",
      path: [
        "AnnotatedHearingOutcome",
        "HearingOutcome",
        "Case",
        "HearingDefendant",
        "Offence",
        1,
        "Result",
        1,
        "ResultClass"
      ]
    })
    expect(addRemandOperation).toHaveBeenCalledTimes(0)
    expect([...params.remandCcrs]).toHaveLength(0)
    expect([...params.adjPreJudgementRemandCcrs]).toHaveLength(0)
  })

  it("should call addRemandOperation, add ccrId to adjPreJudgementRemandCcrs and remandCcrs when adjudication does not exist and ccrId has value", () => {
    const params = generateResultClassHandlerParams({
      result: { PNCAdjudicationExists: false } as Result,
      ccrId: "123"
    })

    const exception = handleAdjournmentPreJudgement(params)

    expect(exception).toBeUndefined()
    expect(addRemandOperation).toHaveBeenCalledTimes(1)
    expect([...params.remandCcrs]).toStrictEqual(["123"])
    expect([...params.adjPreJudgementRemandCcrs]).toStrictEqual(["123"])
  })

  it("should call addRemandOperation, add ccrId to adjPreJudgementRemandCcrs when adjudication does not exist and ccrId does not value", () => {
    const params = generateResultClassHandlerParams({
      result: { PNCAdjudicationExists: false } as Result,
      ccrId: undefined
    })

    const exception = handleAdjournmentPreJudgement(params)

    expect(exception).toBeUndefined()
    expect(addRemandOperation).toHaveBeenCalledTimes(1)
    expect([...params.remandCcrs]).toHaveLength(0)
    expect([...params.adjPreJudgementRemandCcrs]).toStrictEqual([undefined])
  })
})
