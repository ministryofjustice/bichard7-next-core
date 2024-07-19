import ResultClass from "../../../../../types/ResultClass"
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import type { Offence, Result } from "../../../../../types/AnnotatedHearingOutcome"
import addNewOperationToOperationSetIfNotPresent from "../../../addNewOperationToOperationSetIfNotPresent"
import addRemandOperation from "../../../addRemandOperation"
import addSubsequentVariationOperations from "../addSubsequentVariationOperations"
import checkRccSegmentApplicability, { RccSegmentApplicability } from "../checkRccSegmentApplicability"
import hasUnmatchedPncOffences from "../hasUnmatchedPncOffences"
import { handleAdjournmentWithJudgement } from "./handleAdjournmentWithJudgement"
import generateResultClassHandlerParams from "../../../../tests/helpers/generateResultClassHandlerParams"

jest.mock("../../../addRemandOperation")
jest.mock("../../../addNewOperationToOperationSetIfNotPresent")
jest.mock("../addSubsequentVariationOperations")
jest.mock("../checkRccSegmentApplicability")
jest.mock("../hasUnmatchedPncOffences")
;(addRemandOperation as jest.Mock).mockImplementation(() => {})
;(addNewOperationToOperationSetIfNotPresent as jest.Mock).mockImplementation(() => {})
;(addSubsequentVariationOperations as jest.Mock).mockImplementation(() => {})
const mockedCheckRccSegmentApplicability = checkRccSegmentApplicability as jest.Mock
const mockedHasUnmatchedPncOffences = hasUnmatchedPncOffences as jest.Mock

describe("handleAdjournmentWithJudgement", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("should call addRemandOperation and add ccrId to remandCcrs when ccrId has value", () => {
    const params = generateResultClassHandlerParams({ ccrId: "234" })

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toBeUndefined()
    expect(addRemandOperation).toHaveBeenCalledTimes(1)
    expect([...params.remandCcrs]).toStrictEqual(["234"])
  })

  it("should call addRemandOperation and should not add ccrId to remandCcrs when ccrId does not have value", () => {
    const params = generateResultClassHandlerParams({ ccrId: undefined })

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toBeUndefined()
    expect(addRemandOperation).toHaveBeenCalledTimes(1)
    expect([...params.remandCcrs]).toStrictEqual([])
  })

  it("should add PENHRG operation when fixedPenalty is true", () => {
    const params = generateResultClassHandlerParams({ fixedPenalty: true })

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toBeUndefined()
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(1)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledWith("PENHRG", { courtCaseReference: "234" }, [
      { dummy: "Main Operations" }
    ])
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(0)
    expect(addRemandOperation).toHaveBeenCalledTimes(1)
    expect([...params.remandCcrs]).toStrictEqual(["234"])
  })

  it("should add SUBVAR operation when adjudication exists", () => {
    const params = generateResultClassHandlerParams({
      fixedPenalty: false,
      result: { ResultClass: ResultClass.ADJOURNMENT_WITH_JUDGEMENT, PNCAdjudicationExists: true } as Result
    })

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toBeUndefined()
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(0)
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(1)
    expect(addSubsequentVariationOperations).toHaveBeenCalledWith(
      false,
      [{ dummy: "Main Operations" }],
      params.aho,
      ExceptionCode.HO200101,
      false,
      1,
      1,
      { courtCaseReference: "234" }
    )
    expect(addRemandOperation).toHaveBeenCalledTimes(1)
    expect([...params.remandCcrs]).toStrictEqual(["234"])
  })

  it("should only generate exception HO200124 when HO200124 and HO200108 conditions are met", () => {
    const params = generateResultClassHandlerParams({ pncDisposalCode: 2060 })
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
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(0)
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(0)
    expect(addRemandOperation).toHaveBeenCalledTimes(1)
    expect([...params.remandCcrs]).toStrictEqual(["234"])
  })

  it("should generate exception HO200108 when HO200124 condition is not met and case requires RCC and has reportable offences", () => {
    const params = generateResultClassHandlerParams({ pncDisposalCode: 2060, allResultsAlreadyOnPnc: true })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseRequiresRccAndHasReportableOffences)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toBeUndefined()
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(1)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledWith("DISARR", { courtCaseReference: "234" }, [
      { dummy: "Main Operations" }
    ])
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(0)
    expect(addRemandOperation).toHaveBeenCalledTimes(1)
    expect([...params.remandCcrs]).toStrictEqual(["234"])
  })

  it("should generate exception HO200108 when HO200124 condition is not met and case does not require RCC", () => {
    const params = generateResultClassHandlerParams({ pncDisposalCode: 2060, allResultsAlreadyOnPnc: true })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toBeUndefined()
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(1)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledWith("DISARR", { courtCaseReference: "234" }, [
      { dummy: "Main Operations" }
    ])
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(0)
    expect(addRemandOperation).toHaveBeenCalledTimes(1)
    expect([...params.remandCcrs]).toStrictEqual(["234"])
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
    const params = generateResultClassHandlerParams({ offence: { AddedByTheCourt: true } as Offence })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toBeUndefined()
  })

  it("should add DISARR to operations when result does not meet HO200124 and HO200108 conditions and offence is not added by the court", () => {
    const params = generateResultClassHandlerParams({
      offence: { AddedByTheCourt: false } as Offence,
      allResultsAlreadyOnPnc: true
    })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toBeUndefined()
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(1)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledWith("DISARR", { courtCaseReference: "234" }, [
      { dummy: "Main Operations" }
    ])
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(0)
    expect(addRemandOperation).toHaveBeenCalledTimes(1)
    expect([...params.remandCcrs]).toStrictEqual(["234"])
  })

  it("should add DISARR to OAAC DISARR operations when result does not meet HO200124 and HO200108 conditions and offence is added by the court and offence does not have a 2007 result code", () => {
    const params = generateResultClassHandlerParams({
      offence: { AddedByTheCourt: true } as Offence,
      contains2007Result: false,
      allResultsAlreadyOnPnc: true
    })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toBeUndefined()
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(1)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledWith("DISARR", { courtCaseReference: "234" }, [
      { dummy: "OAAC DISARR Operations" }
    ])
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(0)
    expect(addRemandOperation).toHaveBeenCalledTimes(1)
    expect([...params.remandCcrs]).toStrictEqual(["234"])
  })

  it("should not add DISARR to OAAC DISARR operations when result does not meet HO200124 and HO200108 conditions and offence is added by the court but offence has a 2007 result code", () => {
    const params = generateResultClassHandlerParams({
      offence: { AddedByTheCourt: true } as Offence,
      contains2007Result: true,
      allResultsAlreadyOnPnc: true
    })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toBeUndefined()
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(0)
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(0)
    expect(addRemandOperation).toHaveBeenCalledTimes(1)
    expect([...params.remandCcrs]).toStrictEqual(["234"])
  })
})
