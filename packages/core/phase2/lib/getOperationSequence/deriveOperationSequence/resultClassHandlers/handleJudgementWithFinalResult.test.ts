import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import addNewOperationToOperationSetIfNotPresent from "../../../addNewOperationToOperationSetIfNotPresent"
import addSubsequentVariationOperations from "../addSubsequentVariationOperations"
import checkRccSegmentApplicability, { RccSegmentApplicability } from "../checkRccSegmentApplicability"
import hasUnmatchedPncOffences from "../hasUnmatchedPncOffences"
import { handleJudgementWithFinalResult } from "./handleJudgementWithFinalResult"
import generateResultClassHandlerParams from "../../../../tests/helpers/generateResultClassHandlerParams"
import type { Offence } from "../../../../../types/AnnotatedHearingOutcome"

jest.mock("../../../addNewOperationToOperationSetIfNotPresent")
jest.mock("../addSubsequentVariationOperations")
jest.mock("../checkRccSegmentApplicability")
jest.mock("../hasUnmatchedPncOffences")
;(addNewOperationToOperationSetIfNotPresent as jest.Mock).mockImplementation(() => {})
;(addSubsequentVariationOperations as jest.Mock).mockImplementation(() => {})

const mockedCheckRccSegmentApplicability = checkRccSegmentApplicability as jest.Mock
const mockedHasUnmatchedPncOffences = hasUnmatchedPncOffences as jest.Mock

describe("handleJudgementWithFinalResult", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("should add PENHRG operation when fixedPenalty is true and ccrId has value", () => {
    const params = generateResultClassHandlerParams({ fixedPenalty: true })

    const exception = handleJudgementWithFinalResult(params)

    expect(exception).toBeUndefined()
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(1)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledWith("PENHRG", { courtCaseReference: "234" }, [
      { dummy: "Main Operations" }
    ])
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(0)
  })

  it("should add PENHRG operation when fixedPenalty is true and ccrId does not have value", () => {
    const params = generateResultClassHandlerParams({ fixedPenalty: true, ccrId: undefined })

    const exception = handleJudgementWithFinalResult(params)

    expect(exception).toBeUndefined()
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(1)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledWith("PENHRG", undefined, [
      { dummy: "Main Operations" }
    ])
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(0)
  })

  it("should add SUBVAR operation when adjudication exists and ccrId has value", () => {
    const params = generateResultClassHandlerParams({ fixedPenalty: false, adjudicationExists: true })

    const exception = handleJudgementWithFinalResult(params)

    expect(exception).toBeUndefined()
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(0)
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(1)
    expect(addSubsequentVariationOperations).toHaveBeenCalledWith(
      false,
      [{ dummy: "Main Operations" }],
      params.aho,
      ExceptionCode.HO200104,
      false,
      1,
      1,
      { courtCaseReference: "234" }
    )
  })

  it("should add SUBVAR operation when adjudication exists and ccrId does not have value", () => {
    const params = generateResultClassHandlerParams({ fixedPenalty: false, adjudicationExists: true, ccrId: undefined })

    const exception = handleJudgementWithFinalResult(params)

    expect(exception).toBeUndefined()
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(0)
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(1)
    expect(addSubsequentVariationOperations).toHaveBeenCalledWith(
      false,
      [{ dummy: "Main Operations" }],
      params.aho,
      ExceptionCode.HO200104,
      false,
      1,
      1,
      undefined
    )
  })

  it("should only generate exception HO200124 when HO200124 and HO200108 conditions are met", () => {
    const params = generateResultClassHandlerParams({ pncDisposalCode: 2060 })
    mockedCheckRccSegmentApplicability.mockReturnValue(
      RccSegmentApplicability.CaseRequiresRccButHasNoReportableOffences
    )
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const exception = handleJudgementWithFinalResult(params)

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
  })

  it("should generate exception HO200108 when HO200124 condition is not met and case requires RCC and has reportable offences", () => {
    const params = generateResultClassHandlerParams({ pncDisposalCode: 2060, allResultsAlreadyOnPnc: true })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseRequiresRccAndHasReportableOffences)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const exception = handleJudgementWithFinalResult(params)

    expect(exception).toBeUndefined()
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(1)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledWith("DISARR", { courtCaseReference: "234" }, [
      { dummy: "Main Operations" }
    ])
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(0)
  })

  it("should generate exception HO200108 when HO200124 condition is not met and case does not require RCC", () => {
    const params = generateResultClassHandlerParams({ pncDisposalCode: 2060, allResultsAlreadyOnPnc: true })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const exception = handleJudgementWithFinalResult(params)

    expect(exception).toBeUndefined()
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(1)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledWith("DISARR", { courtCaseReference: "234" }, [
      { dummy: "Main Operations" }
    ])
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(0)
  })

  it("should not generate exception HO200124 when all results are already on PNC", () => {
    const params = generateResultClassHandlerParams({ allResultsAlreadyOnPnc: true })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const exception = handleJudgementWithFinalResult(params)

    expect(exception).toBeUndefined()
  })

  it("should not generate exception HO200124 when all PNC offences match", () => {
    const params = generateResultClassHandlerParams()
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(false)

    const exception = handleJudgementWithFinalResult(params)

    expect(exception).toBeUndefined()
  })

  it("should not generate exception HO200124 when case is added by the court", () => {
    const params = generateResultClassHandlerParams({ offence: { AddedByTheCourt: true } as Offence })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const exception = handleJudgementWithFinalResult(params)

    expect(exception).toBeUndefined()
  })

  it("should add DISARR to operations when result does not meet HO200124 and HO200108 conditions and offence is not added by the court", () => {
    const params = generateResultClassHandlerParams({
      offence: { AddedByTheCourt: false } as Offence,
      allResultsAlreadyOnPnc: true
    })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const exception = handleJudgementWithFinalResult(params)

    expect(exception).toBeUndefined()
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(1)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledWith("DISARR", { courtCaseReference: "234" }, [
      { dummy: "Main Operations" }
    ])
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(0)
  })

  it("should add DISARR to OAAC DISARR operations when result does not meet HO200124 and HO200108 conditions, offence is added by the court, offence does not have a 2007 result code, and ccrId has value", () => {
    const params = generateResultClassHandlerParams({
      offence: { AddedByTheCourt: true } as Offence,
      contains2007Result: false,
      allResultsAlreadyOnPnc: true
    })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const exception = handleJudgementWithFinalResult(params)

    expect(exception).toBeUndefined()
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(1)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledWith("DISARR", { courtCaseReference: "234" }, [
      { dummy: "OAAC DISARR Operations" }
    ])
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(0)
  })

  it("should add DISARR to OAAC DISARR operations when result does not meet HO200124 and HO200108 conditions, offence is added by the court, offence does not have a 2007 result code, and ccrId does not have value", () => {
    const params = generateResultClassHandlerParams({
      offence: { AddedByTheCourt: true } as Offence,
      contains2007Result: false,
      allResultsAlreadyOnPnc: true,
      ccrId: undefined
    })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const exception = handleJudgementWithFinalResult(params)

    expect(exception).toBeUndefined()
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(1)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledWith("DISARR", undefined, [
      { dummy: "OAAC DISARR Operations" }
    ])
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(0)
  })

  it("should not add DISARR to OAAC DISARR operations when result does not meet HO200124 and HO200108 conditions and offence is added by the court but offence has a 2007 result code", () => {
    const params = generateResultClassHandlerParams({
      offence: { AddedByTheCourt: true } as Offence,
      contains2007Result: true,
      allResultsAlreadyOnPnc: true
    })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const exception = handleJudgementWithFinalResult(params)

    expect(exception).toBeUndefined()
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(0)
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(0)
  })
})
