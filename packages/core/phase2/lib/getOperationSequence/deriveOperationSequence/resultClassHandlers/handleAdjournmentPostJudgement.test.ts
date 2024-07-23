import type { Offence, Result } from "../../../../../types/AnnotatedHearingOutcome";
import generateResultClassHandlerParams from "../../../../tests/helpers/generateResultClassHandlerParams";
import createRemandOperation from "../../../createRemandOperation";
import { handleAdjournmentPostJudgement } from "./handleAdjournmentPostJudgement";

jest.mock("../../../createRemandOperation.test")
;(createRemandOperation as jest.Mock).mockImplementation(() => {})

describe("handleAdjournmentPostJudgement", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("should call createRemandOperation.test and add the ccrId to remandCcrs when adjudication exists and ccrId has value", () => {
    const params = generateResultClassHandlerParams({
      result: { PNCAdjudicationExists: true } as Result
    })

    const exception = handleAdjournmentPostJudgement(params)

    expect(exception).toBeUndefined()
    expect(createRemandOperation).toHaveBeenCalledTimes(1)
  })

  it("should call createRemandOperation.test and should not add the ccrId to remandCcrs when adjudication exists and ccrId does not have value", () => {
    const params = generateResultClassHandlerParams({
      result: { PNCAdjudicationExists: true } as Result,
      offence: {
        CourtCaseReferenceNumber: undefined
      } as Offence
    })

    const exception = handleAdjournmentPostJudgement(params)

    expect(exception).toBeUndefined()
    expect(createRemandOperation).toHaveBeenCalledTimes(1)
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
    expect(createRemandOperation).toHaveBeenCalledTimes(0)
  })

  it("should not generate exception HO200103 when adjudication does not exists and result is added by court", () => {
    const params = generateResultClassHandlerParams({
      result: { PNCAdjudicationExists: false } as Result,
      offence: { AddedByTheCourt: true } as Offence,
      offenceIndex: 1
    })

    const exception = handleAdjournmentPostJudgement(params)

    expect(exception).toBeUndefined()
    expect(createRemandOperation).toHaveBeenCalledTimes(0)
  })
})
