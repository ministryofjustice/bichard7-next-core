import type { Offence, Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import { PncOperation } from "@moj-bichard7/common/types/PncOperation"
import ResultClass from "@moj-bichard7/common/types/ResultClass"

import generateResultClassHandlerParams from "../../../tests/helpers/generateResultClassHandlerParams"
import hasUnmatchedPoliceOffences from "../../hasUnmatchedPoliceOffences"
import { handleJudgementWithFinalResult } from "./handleJudgementWithFinalResult"

jest.mock("../../hasUnmatchedPoliceOffences")
const mockedHasUnmatchedPoliceOffences = hasUnmatchedPoliceOffences as jest.Mock

describe("handleJudgementWithFinalResult", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("returns penalty hearing operation with data when penalty notice case reference number and court case reference exists", () => {
    const params = generateResultClassHandlerParams({ fixedPenalty: true })

    const operations = handleJudgementWithFinalResult(params)

    expect(operations).toStrictEqual([
      { code: PncOperation.PENALTY_HEARING, data: { courtCaseReference: "234" }, status: "NotAttempted" }
    ])
  })

  it("returns penalty hearing operation without data when penalty notice case reference number and court case reference doesn't exist", () => {
    const params = generateResultClassHandlerParams({
      fixedPenalty: true,
      offence: {
        CourtCaseReferenceNumber: undefined
      } as Offence
    })

    const operations = handleJudgementWithFinalResult(params)

    expect(operations).toStrictEqual([{ code: PncOperation.PENALTY_HEARING, data: undefined, status: "NotAttempted" }])
  })

  it("returns disposal updated operation with data when PNC adjudication and court case reference exists", () => {
    const params = generateResultClassHandlerParams({
      fixedPenalty: false,
      resubmitted: true,
      result: { ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT, PNCAdjudicationExists: true } as Result
    })

    const operations = handleJudgementWithFinalResult(params)

    expect(operations).toStrictEqual([
      { code: PncOperation.DISPOSAL_UPDATED, data: { courtCaseReference: "234" }, status: "NotAttempted" }
    ])
  })

  it("returns disposal updated operation without data when adjudication exists and court case reference doesn't exist", () => {
    const params = generateResultClassHandlerParams({
      fixedPenalty: false,
      resubmitted: true,
      result: { ResultClass: ResultClass.JUDGEMENT_WITH_FINAL_RESULT, PNCAdjudicationExists: true } as Result,
      offence: {
        CourtCaseReferenceNumber: undefined
      } as Offence
    })

    const operations = handleJudgementWithFinalResult(params)

    expect(operations).toStrictEqual([{ code: PncOperation.DISPOSAL_UPDATED, data: undefined, status: "NotAttempted" }])
  })

  it("returns disposal operation when offence is not added by the court", () => {
    const params = generateResultClassHandlerParams({
      offence: { AddedByTheCourt: false, Result: [{ PNCDisposalType: 4000 }] } as Offence,
      areAllResultsInPoliceCourtCase: true
    })
    mockedHasUnmatchedPoliceOffences.mockReturnValue(true)

    const operations = handleJudgementWithFinalResult(params)

    expect(operations).toStrictEqual([
      { code: PncOperation.NORMAL_DISPOSAL, data: { courtCaseReference: "234" }, status: "NotAttempted" }
    ])
  })

  it("returns disposal operation with data and added by the court when offence is added by the court and has no 2007 result code", () => {
    const params = generateResultClassHandlerParams({
      offence: { AddedByTheCourt: true, Result: [{ PNCDisposalType: 4000 }] } as Offence,
      areAllResultsInPoliceCourtCase: true
    })
    mockedHasUnmatchedPoliceOffences.mockReturnValue(true)

    const operations = handleJudgementWithFinalResult(params)

    expect(operations).toStrictEqual([
      {
        code: PncOperation.NORMAL_DISPOSAL,
        data: { courtCaseReference: "234" },
        addedByTheCourt: true,
        status: "NotAttempted"
      }
    ])
  })

  it("returns disposal operation with added by the court but without data when offence is added by the court, has no 2007 result code and no court case reference", () => {
    const params = generateResultClassHandlerParams({
      offence: {
        AddedByTheCourt: true,
        Result: [{ PNCDisposalType: 4000 }],
        CourtCaseReferenceNumber: undefined
      } as Offence,
      areAllResultsInPoliceCourtCase: true
    })
    mockedHasUnmatchedPoliceOffences.mockReturnValue(true)

    const operations = handleJudgementWithFinalResult(params)

    expect(operations).toStrictEqual([
      { code: PncOperation.NORMAL_DISPOSAL, data: undefined, addedByTheCourt: true, status: "NotAttempted" }
    ])
  })

  it("returns no operations when offence is added by the court but has a 2007 result code", () => {
    const params = generateResultClassHandlerParams({
      offence: { AddedByTheCourt: true, Result: [{ PNCDisposalType: 2007 }] } as Offence,
      areAllResultsInPoliceCourtCase: true
    })
    mockedHasUnmatchedPoliceOffences.mockReturnValue(true)

    const operations = handleJudgementWithFinalResult(params)

    expect(operations).toHaveLength(0)
  })

  it("returns no operations when results are not on PNC, there are unmatched PNC offences, and the offence is not added by the court", () => {
    const params = generateResultClassHandlerParams({ result: { PNCDisposalType: 2060 } as Result })
    mockedHasUnmatchedPoliceOffences.mockReturnValue(true)

    const operations = handleJudgementWithFinalResult(params)

    expect(operations).toHaveLength(0)
  })
})
