import type { Offence, Result } from "../../../../types/AnnotatedHearingOutcome"
import { PncOperation } from "../../../../types/PncOperation"
import ResultClass from "../../../../types/ResultClass"
import generateResultClassHandlerParams from "../../../tests/helpers/generateResultClassHandlerParams"
import { areAllResultsOnPnc } from "../areAllResultsOnPnc"
import checkCaseRequiresRccButHasNoReportableOffences from "../checkCaseRequiresRccButHasNoReportableOffences"
import hasUnmatchedPncOffences from "../hasUnmatchedPncOffences"
import { handleJudgementWithFinalResult } from "./handleJudgementWithFinalResult"

jest.mock("../checkCaseRequiresRccButHasNoReportableOffences")
jest.mock("../hasUnmatchedPncOffences")
jest.mock("../areAllResultsOnPnc")

const mockedCheckCaseRequiresRccButHasNoReportableOffences = checkCaseRequiresRccButHasNoReportableOffences as jest.Mock
const mockedHasUnmatchedPncOffences = hasUnmatchedPncOffences as jest.Mock
const mockedAreAllResultsOnPnc = areAllResultsOnPnc as jest.Mock

describe("handleJudgementWithFinalResult", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("should return PENHRG operation when fixedPenalty is true and ccrId has value", () => {
    const params = generateResultClassHandlerParams({ fixedPenalty: true })

    const { exceptions, operations } = handleJudgementWithFinalResult(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      { code: PncOperation.PENALTY_HEARING, data: { courtCaseReference: "234" }, status: "NotAttempted" }
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
    expect(operations).toStrictEqual([{ code: PncOperation.PENALTY_HEARING, data: undefined, status: "NotAttempted" }])
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
      { code: PncOperation.DISPOSAL_UPDATED, data: { courtCaseReference: "234" }, status: "NotAttempted" }
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
    expect(operations).toStrictEqual([{ code: PncOperation.DISPOSAL_UPDATED, data: undefined, status: "NotAttempted" }])
  })

  it("should return DISARR operation when result does not meet HO200124 and HO200108 conditions and offence is not added by the court", () => {
    const params = generateResultClassHandlerParams({
      offence: { AddedByTheCourt: false, Result: [{ PNCDisposalType: 4000 }] } as Offence,
      allResultsAlreadyOnPnc: true
    })
    mockedCheckCaseRequiresRccButHasNoReportableOffences.mockReturnValue(false)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const { exceptions, operations } = handleJudgementWithFinalResult(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      { code: PncOperation.NORMAL_DISPOSAL, data: { courtCaseReference: "234" }, status: "NotAttempted" }
    ])
  })

  it("should return OAAC DISARR operation when result does not meet HO200124 and HO200108 conditions, offence is added by the court, offence does not have a 2007 result code, and ccrId has value", () => {
    const params = generateResultClassHandlerParams({
      offence: { AddedByTheCourt: true, Result: [{ PNCDisposalType: 4000 }] } as Offence,
      allResultsAlreadyOnPnc: true
    })
    mockedCheckCaseRequiresRccButHasNoReportableOffences.mockReturnValue(false)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const { exceptions, operations } = handleJudgementWithFinalResult(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      {
        code: PncOperation.NORMAL_DISPOSAL,
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
    mockedCheckCaseRequiresRccButHasNoReportableOffences.mockReturnValue(false)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const { exceptions, operations } = handleJudgementWithFinalResult(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      { code: PncOperation.NORMAL_DISPOSAL, data: undefined, addedByTheCourt: true, status: "NotAttempted" }
    ])
  })

  it("should not return OAAC DISARR operation when result does not meet HO200124 and HO200108 conditions and offence is added by the court but offence has a 2007 result code", () => {
    const params = generateResultClassHandlerParams({
      offence: { AddedByTheCourt: true, Result: [{ PNCDisposalType: 2007 }] } as Offence,
      allResultsAlreadyOnPnc: true
    })
    mockedCheckCaseRequiresRccButHasNoReportableOffences.mockReturnValue(false)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const { exceptions, operations } = handleJudgementWithFinalResult(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toHaveLength(0)
  })

  it("should return no operations when results are not on PNC, there are unmatched PNC offences, and the offence is not added by the court", () => {
    const params = generateResultClassHandlerParams({ result: { PNCDisposalType: 2060 } as Result })
    mockedAreAllResultsOnPnc.mockReturnValue(false)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const { operations } = handleJudgementWithFinalResult(params)

    expect(operations).toHaveLength(0)
  })
})
