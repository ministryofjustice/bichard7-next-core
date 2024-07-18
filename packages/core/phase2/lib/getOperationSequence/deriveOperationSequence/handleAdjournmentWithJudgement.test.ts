jest.mock("../../addRemandOperation")
jest.mock("../../addNewOperationToOperationSetIfNotPresent")
jest.mock("./addSubsequentVariationOperations")
jest.mock("./checkRccSegmentApplicability")
jest.mock("./hasUnmatchedPncOffences")
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import ResultClass from "../../../../phase1/types/ResultClass"
import type { Offence } from "../../../../types/AnnotatedHearingOutcome"
import addNewOperationToOperationSetIfNotPresent from "../../addNewOperationToOperationSetIfNotPresent"
import addRemandOperation from "../../addRemandOperation"
import addSubsequentVariationOperations from "./addSubsequentVariationOperations"
import checkRccSegmentApplicability, { RccSegmentApplicability } from "./checkRccSegmentApplicability"
import type { ResultClassHandlerParams } from "./deriveOperationSequence"
import { handleAdjournmentWithJudgement } from "./handleAdjournmentWithJudgement"
import hasUnmatchedPncOffences from "./hasUnmatchedPncOffences"
;(addRemandOperation as jest.Mock).mockImplementation(() => {})
;(addNewOperationToOperationSetIfNotPresent as jest.Mock).mockImplementation(() => {})
;(addSubsequentVariationOperations as jest.Mock).mockImplementation(() => {})
const mockedCheckRccSegmentApplicability = checkRccSegmentApplicability as jest.Mock
const mockedHasUnmatchedPncOffences = hasUnmatchedPncOffences as jest.Mock

const generateParams = (overrides: Partial<ResultClassHandlerParams> = {}) =>
  structuredClone({
    aho: { Exceptions: [] },
    adjudicationExists: false,
    operations: [{ dummy: "Main Operations" }],
    remandCcrs: new Set<string>(),
    fixedPenalty: false,
    ccrId: "234",
    resubmitted: false,
    allResultsAlreadyOnPnc: false,
    offence: { AddedByTheCourt: false },
    result: { ResultClass: ResultClass.ADJOURNMENT_WITH_JUDGEMENT },
    offenceIndex: 1,
    resultIndex: 1,
    pncDisposalCode: 4000,
    contains2007Result: true,
    oAacDisarrOperations: [{ dummy: "OAAC DISARR Operations" }],
    ...overrides
  }) as unknown as ResultClassHandlerParams

describe("handleAdjournmentWithJudgement", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("should call addRemandOperation and add ccrId to remandCcrs when ccrId has value", () => {
    const params = generateParams({ ccrId: "234" })

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toBeUndefined()
    expect(addRemandOperation).toHaveBeenCalledTimes(1)
    expect([...params.remandCcrs]).toStrictEqual(["234"])
  })

  it("should call addRemandOperation and should not add ccrId to remandCcrs when ccrId does not have value", () => {
    const params = generateParams({ ccrId: undefined })

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toBeUndefined()
    expect(addRemandOperation).toHaveBeenCalledTimes(1)
    expect([...params.remandCcrs]).toStrictEqual([])
  })

  it("should add PENHRG operation when fixedPenalty is true", () => {
    const params = generateParams({ fixedPenalty: true })

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
    const params = generateParams({ fixedPenalty: false, adjudicationExists: true })

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toBeUndefined()
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(0)
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(1)
    expect(addSubsequentVariationOperations).toHaveBeenCalledWith(
      false,
      [{ dummy: "Main Operations" }],
      { Exceptions: [] },
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
    const params = generateParams({ pncDisposalCode: 2060 })
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
    const params = generateParams({ pncDisposalCode: 2060, allResultsAlreadyOnPnc: true })
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
    const params = generateParams({ pncDisposalCode: 2060, allResultsAlreadyOnPnc: true })
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
    const params = generateParams({ allResultsAlreadyOnPnc: true })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toBeUndefined()
  })

  it("should not generate exception HO200124 when all PNC offences match", () => {
    const params = generateParams()
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(false)

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toBeUndefined()
  })

  it("should not generate exception HO200124 when case is added by the court", () => {
    const params = generateParams({ offence: { AddedByTheCourt: true } as Offence })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const exception = handleAdjournmentWithJudgement(params)

    expect(exception).toBeUndefined()
  })

  it("should add DISARR to operations when result does not meet HO200124 and HO200108 conditions and offence is not added by the court", () => {
    const params = generateParams({ offence: { AddedByTheCourt: false } as Offence, allResultsAlreadyOnPnc: true })
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
    const params = generateParams({
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
    const params = generateParams({
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
