import type { Offence, Result } from "../../../../../types/AnnotatedHearingOutcome"
import ResultClass from "../../../../../types/ResultClass"
import generateResultClassHandlerParams from "../../../../tests/helpers/generateResultClassHandlerParams"
import { PNCMessageType } from "../../../../types/operationCodes"
import checkRccSegmentApplicability, { RccSegmentApplicability } from "../checkRccSegmentApplicability"
import hasUnmatchedPncOffences from "../hasUnmatchedPncOffences"
import { handleJudgementWithFinalResult } from "./handleJudgementWithFinalResult"

jest.mock("../checkRccSegmentApplicability")
jest.mock("../hasUnmatchedPncOffences")

const mockedCheckRccSegmentApplicability = checkRccSegmentApplicability as jest.Mock
const mockedHasUnmatchedPncOffences = hasUnmatchedPncOffences as jest.Mock

describe("handleJudgementWithFinalResult", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("should return PENHRG operation when fixedPenalty is true and ccrId has value", () => {
    const params = generateResultClassHandlerParams({ fixedPenalty: true })

    const { exceptions, operations } = handleJudgementWithFinalResult(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      { code: PNCMessageType.PENALTY_HEARING, data: { courtCaseReference: "234" }, status: "NotAttempted" }
    ])
  })

  it("should return PENHRG operation when fixedPenalty is true and ccrId does not have value", () => {
    const params = generateResultClassHandlerParams({
      fixedPenalty: true,
      offence: {
        CourtCaseReferenceNumber: undefined
      } as Offence
    })

    const { exceptions, operations } = handleJudgementWithFinalResult(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      { code: PNCMessageType.PENALTY_HEARING, data: undefined, status: "NotAttempted" }
    ])
  })

  it("should return SUBVAR operation when adjudication exists, and ccrId has value", () => {
    const params = generateResultClassHandlerParams({
      fixedPenalty: false,
      resubmitted: true,
      result: { ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT, PNCAdjudicationExists: true } as Result
    })

    const { exceptions, operations } = handleJudgementWithFinalResult(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      { code: PNCMessageType.DISPOSAL_UPDATED, data: { courtCaseReference: "234" }, status: "NotAttempted" }
    ])
  })

  it("should return SUBVAR operation when adjudication exists and ccrId does not have value", () => {
    const params = generateResultClassHandlerParams({
      fixedPenalty: false,
      resubmitted: true,
      result: { ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT, PNCAdjudicationExists: true } as Result,
      offence: {
        CourtCaseReferenceNumber: undefined
      } as Offence
    })

    const { exceptions, operations } = handleJudgementWithFinalResult(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      { code: PNCMessageType.DISPOSAL_UPDATED, data: undefined, status: "NotAttempted" }
    ])
  })

  it("should only return exception HO200124 when HO200124 and HO200108 conditions are met", () => {
    const params = generateResultClassHandlerParams({ result: { PNCDisposalType: 2060 } as Result })
    mockedCheckRccSegmentApplicability.mockReturnValue(
      RccSegmentApplicability.CaseRequiresRccButHasNoReportableOffences
    )
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const { exceptions, operations } = handleJudgementWithFinalResult(params)

    expect(exceptions).toStrictEqual([
      {
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
      }
    ])
    expect(operations).toHaveLength(0)
  })

  it("should return exception HO200108 when HO200124 condition is not met and case requires RCC and has no reportable offences", () => {
    const params = generateResultClassHandlerParams({
      result: { PNCDisposalType: 2060 } as Result,
      allResultsAlreadyOnPnc: true
    })
    mockedCheckRccSegmentApplicability.mockReturnValue(
      RccSegmentApplicability.CaseRequiresRccButHasNoReportableOffences
    )
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const { exceptions, operations } = handleJudgementWithFinalResult(params)

    expect(exceptions).toStrictEqual([
      {
        code: "HO200108",
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
      }
    ])
    expect(operations).toStrictEqual([
      { code: PNCMessageType.NORMAL_DISPOSAL, data: { courtCaseReference: "234" }, status: "NotAttempted" }
    ])
  })

  it("should not return exception HO200124 when all results are already on PNC", () => {
    const params = generateResultClassHandlerParams({ allResultsAlreadyOnPnc: true })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const { exceptions, operations } = handleJudgementWithFinalResult(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toHaveLength(1)
  })

  it("should not return exception HO200124 when all PNC offences match", () => {
    const params = generateResultClassHandlerParams()
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(false)

    const { exceptions, operations } = handleJudgementWithFinalResult(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toHaveLength(1)
  })

  it("should not return exception HO200124 when case is added by the court", () => {
    const params = generateResultClassHandlerParams({
      offence: { AddedByTheCourt: true, Result: [{ PNCDisposalType: 4000 }] } as Offence
    })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const { exceptions, operations } = handleJudgementWithFinalResult(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toHaveLength(1)
  })

  it("should return DISARR operation when result does not meet HO200124 and HO200108 conditions and offence is not added by the court", () => {
    const params = generateResultClassHandlerParams({
      offence: { AddedByTheCourt: false, Result: [{ PNCDisposalType: 4000 }] } as Offence,
      allResultsAlreadyOnPnc: true
    })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const { exceptions, operations } = handleJudgementWithFinalResult(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      { code: PNCMessageType.NORMAL_DISPOSAL, data: { courtCaseReference: "234" }, status: "NotAttempted" }
    ])
  })

  it("should return OAAC DISARR operation when result does not meet HO200124 and HO200108 conditions, offence is added by the court, offence does not have a 2007 result code, and ccrId has value", () => {
    const params = generateResultClassHandlerParams({
      offence: { AddedByTheCourt: true, Result: [{ PNCDisposalType: 4000 }] } as Offence,
      allResultsAlreadyOnPnc: true
    })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const { exceptions, operations } = handleJudgementWithFinalResult(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      {
        code: PNCMessageType.NORMAL_DISPOSAL,
        data: { courtCaseReference: "234" },
        addedByTheCourt: true,
        status: "NotAttempted"
      }
    ])
  })

  it("should return OAAC DISARR operation when result does not meet HO200124 and HO200108 conditions, offence is added by the court, offence does not have a 2007 result code, and ccrId does not have value", () => {
    const params = generateResultClassHandlerParams({
      offence: {
        AddedByTheCourt: true,
        Result: [{ PNCDisposalType: 4000 }],
        CourtCaseReferenceNumber: undefined
      } as Offence,
      allResultsAlreadyOnPnc: true
    })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const { exceptions, operations } = handleJudgementWithFinalResult(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      { code: PNCMessageType.NORMAL_DISPOSAL, data: undefined, addedByTheCourt: true, status: "NotAttempted" }
    ])
  })

  it("should not return OAAC DISARR operation when result does not meet HO200124 and HO200108 conditions and offence is added by the court but offence has a 2007 result code", () => {
    const params = generateResultClassHandlerParams({
      offence: { AddedByTheCourt: true, Result: [{ PNCDisposalType: 2007 }] } as Offence,
      allResultsAlreadyOnPnc: true
    })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const { exceptions, operations } = handleJudgementWithFinalResult(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toHaveLength(0)
  })
})
