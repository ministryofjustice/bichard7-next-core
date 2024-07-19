import generateResultClassHandlerParams from "../../../../tests/helpers/generateResultClassHandlerParams"
import type { Offence, Result } from "../../../../../types/AnnotatedHearingOutcome"
import addRemandOperation from "../../../addRemandOperation"
import { handleAdjournmentPostJudgement } from "./handleAdjournmentPostJudgement"

jest.mock("../../../addRemandOperation")
;(addRemandOperation as jest.Mock).mockImplementation(() => {})

describe("handleAdjournmentPostJudgement", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("should call addRemandOperation and add the ccrId to remandCcrs when adjudication exists and ccrId has value", () => {
    const params = generateResultClassHandlerParams({
      result: { PNCAdjudicationExists: true } as Result,
      ccrId: "123"
    })

    const exception = handleAdjournmentPostJudgement(params)

    expect(exception).toBeUndefined()
    expect(addRemandOperation).toHaveBeenCalledTimes(1)
    expect([...params.remandCcrs]).toEqual(["123"])
  })

  it("should call addRemandOperation and should not add the ccrId to remandCcrs when adjudication exists and ccrId does not have value", () => {
    const params = generateResultClassHandlerParams({
      result: { PNCAdjudicationExists: true } as Result,
      ccrId: undefined
    })

    const exception = handleAdjournmentPostJudgement(params)

    expect(exception).toBeUndefined()
    expect(addRemandOperation).toHaveBeenCalledTimes(1)
    expect([...params.remandCcrs]).toHaveLength(0)
  })

  it("should generate exception HO200103 when adjudication does not exists and result is not added by court", () => {
    const params = generateResultClassHandlerParams({
      result: { PNCAdjudicationExists: false } as Result,
      offence: { AddedByTheCourt: false } as Offence,
      offenceIndex: 1
    })

    const exception = handleAdjournmentPostJudgement(params)

    expect(exception).toStrictEqual({
      code: "HO200103",
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
  })

  it("should not generate exception HO200103 when adjudication does not exists and result is added by court", () => {
    const params = generateResultClassHandlerParams({
      result: { PNCAdjudicationExists: false } as Result,
      offence: { AddedByTheCourt: true } as Offence,
      offenceIndex: 1
    })

    const exception = handleAdjournmentPostJudgement(params)

    expect(exception).toBeUndefined()
    expect(addRemandOperation).toHaveBeenCalledTimes(0)
    expect([...params.remandCcrs]).toHaveLength(0)
  })
})
