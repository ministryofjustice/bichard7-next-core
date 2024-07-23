import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import type { Offence, Result } from "../../../../../types/AnnotatedHearingOutcome"
import ResultClass from "../../../../../types/ResultClass"
import generateResultClassHandlerParams from "../../../../tests/helpers/generateResultClassHandlerParams"
import createOperation from "../../../createOperation"
import createRemandOperation from "../../../createRemandOperation"
import checkRccSegmentApplicability, { RccSegmentApplicability } from "../checkRccSegmentApplicability"
import createSubsequentVariationOperation from "../createSubsequentVariationOperation"
import hasUnmatchedPncOffences from "../hasUnmatchedPncOffences"
import { handleAdjournmentWithJudgement } from "./handleAdjournmentWithJudgement"

jest.mock("../../../createRemandOperation.test")
jest.mock("../../../createOperation")
jest.mock("../createSubsequentVariationOperation")
jest.mock("../checkRccSegmentApplicability")
jest.mock("../hasUnmatchedPncOffences")
;(createRemandOperation as jest.Mock).mockImplementation(() => {})
;(createOperation as jest.Mock).mockImplementation(() => {})
;(createSubsequentVariationOperation as jest.Mock).mockImplementation(() => {})
const mockedCheckRccSegmentApplicability = checkRccSegmentApplicability as jest.Mock
const mockedHasUnmatchedPncOffences = hasUnmatchedPncOffences as jest.Mock

describe("handleAdjournmentWithJudgement", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("should call createRemandOperation.test and add ccrId to remandCcrs when ccrId has value", () => {
    const params = generateResultClassHandlerParams()

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toBeUndefined()
    expect(createRemandOperation).toHaveBeenCalledTimes(1)
  })

  it("should call createRemandOperation.test and should not add ccrId to remandCcrs when ccrId does not have value", () => {
    const params = generateResultClassHandlerParams({
      offence: {
        CourtCaseReferenceNumber: undefined
      } as Offence
    })

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toBeUndefined()
    expect(createRemandOperation).toHaveBeenCalledTimes(1)
  })

  it("should add PENHRG operation when fixedPenalty is true", () => {
    const params = generateResultClassHandlerParams({ fixedPenalty: true })

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toBeUndefined()
    expect(createOperation).toHaveBeenCalledTimes(1)
    expect(createOperation).toHaveBeenCalledWith("PENHRG", { courtCaseReference: "234" }, [
      { dummy: "Main Operations" }
    ])
    expect(createSubsequentVariationOperation).toHaveBeenCalledTimes(0)
    expect(createRemandOperation).toHaveBeenCalledTimes(1)
  })

  it("should add SUBVAR operation when adjudication exists", () => {
    const params = generateResultClassHandlerParams({
      fixedPenalty: false,
      result: { ResultClass: ResultClass.ADJOURNMENT_WITH_JUDGEMENT, PNCAdjudicationExists: true } as Result
    })

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toBeUndefined()
    expect(createOperation).toHaveBeenCalledTimes(0)
    expect(createSubsequentVariationOperation).toHaveBeenCalledTimes(1)
    expect(createSubsequentVariationOperation).toHaveBeenCalledWith(
      false,
      [{ dummy: "Main Operations" }],
      params.aho,
      ExceptionCode.HO200101,
      false,
      1,
      1,
      { courtCaseReference: "234" }
    )
    expect(createRemandOperation).toHaveBeenCalledTimes(1)
  })

  it("should only generate exception HO200124 when HO200124 and HO200108 conditions are met", () => {
    const params = generateResultClassHandlerParams({ result: { PNCDisposalType: 2060 } as Result })
    mockedCheckRccSegmentApplicability.mockReturnValue(
      RccSegmentApplicability.CaseRequiresRccButHasNoReportableOffences
    )
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toStrictEqual({
      code: "HO200124",
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
    expect(createOperation).toHaveBeenCalledTimes(0)
    expect(createSubsequentVariationOperation).toHaveBeenCalledTimes(0)
    expect(createRemandOperation).toHaveBeenCalledTimes(1)
  })

  it("should generate exception HO200108 when HO200124 condition is not met and case requires RCC and has reportable offences", () => {
    const params = generateResultClassHandlerParams({
      result: { PNCDisposalType: 2060 } as Result,
      allResultsAlreadyOnPnc: true
    })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseRequiresRccAndHasReportableOffences)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toBeUndefined()
    expect(createOperation).toHaveBeenCalledTimes(1)
    expect(createOperation).toHaveBeenCalledWith("DISARR", { courtCaseReference: "234" }, [
      { dummy: "Main Operations" }
    ])
    expect(createSubsequentVariationOperation).toHaveBeenCalledTimes(0)
    expect(createRemandOperation).toHaveBeenCalledTimes(1)
  })

  it("should generate exception HO200108 when HO200124 condition is not met and case does not require RCC", () => {
    const params = generateResultClassHandlerParams({
      result: { PNCDisposalType: 2060 } as Result,
      allResultsAlreadyOnPnc: true
    })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toBeUndefined()
    expect(createOperation).toHaveBeenCalledTimes(1)
    expect(createOperation).toHaveBeenCalledWith("DISARR", { courtCaseReference: "234" }, [
      { dummy: "Main Operations" }
    ])
    expect(createSubsequentVariationOperation).toHaveBeenCalledTimes(0)
    expect(createRemandOperation).toHaveBeenCalledTimes(1)
  })

  it("should not generate exception HO200124 when all results are already on PNC", () => {
    const params = generateResultClassHandlerParams({ allResultsAlreadyOnPnc: true })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toBeUndefined()
  })

  it("should not generate exception HO200124 when all PNC offences match", () => {
    const params = generateResultClassHandlerParams()
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(false)

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toBeUndefined()
  })

  it("should not generate exception HO200124 when case is added by the court", () => {
    const params = generateResultClassHandlerParams({
      offence: { AddedByTheCourt: true, Result: [{ PNCDisposalType: 4000 }] } as Offence
    })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toBeUndefined()
  })

  it("should add DISARR to operations when result does not meet HO200124 and HO200108 conditions and offence is not added by the court", () => {
    const params = generateResultClassHandlerParams({
      offence: { AddedByTheCourt: false, Result: [{ PNCDisposalType: 4000 }] } as Offence,
      allResultsAlreadyOnPnc: true
    })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toBeUndefined()
    expect(createOperation).toHaveBeenCalledTimes(1)
    expect(createOperation).toHaveBeenCalledWith("DISARR", { courtCaseReference: "234" }, [
      { dummy: "Main Operations" }
    ])
    expect(createSubsequentVariationOperation).toHaveBeenCalledTimes(0)
    expect(createRemandOperation).toHaveBeenCalledTimes(1)
  })

  it("should add DISARR to OAAC DISARR operations when result does not meet HO200124 and HO200108 conditions and offence is added by the court and offence does not have a 2007 result code", () => {
    const params = generateResultClassHandlerParams({
      offence: { AddedByTheCourt: true, Result: [{ PNCDisposalType: 4000 }] } as Offence,
      allResultsAlreadyOnPnc: true
    })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toBeUndefined()
    expect(createOperation).toHaveBeenCalledTimes(1)
    expect(createOperation).toHaveBeenCalledWith("DISARR", { courtCaseReference: "234" }, [
      { dummy: "OAAC DISARR Operations" }
    ])
    expect(createSubsequentVariationOperation).toHaveBeenCalledTimes(0)
    expect(createRemandOperation).toHaveBeenCalledTimes(1)
  })

  it("should not add DISARR to OAAC DISARR operations when result does not meet HO200124 and HO200108 conditions and offence is added by the court but offence has a 2007 result code", () => {
    const params = generateResultClassHandlerParams({
      offence: { AddedByTheCourt: true, Result: [{ PNCDisposalType: 2007 }] } as Offence,
      allResultsAlreadyOnPnc: true
    })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toBeUndefined()
    expect(createOperation).toHaveBeenCalledTimes(0)
    expect(createSubsequentVariationOperation).toHaveBeenCalledTimes(0)
    expect(createRemandOperation).toHaveBeenCalledTimes(1)
  })
})
