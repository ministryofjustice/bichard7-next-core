import type { Offence, Result } from "../../../../../types/AnnotatedHearingOutcome"
import { PncOperation } from "../../../../../types/PncOperation"
import ResultClass from "../../../../../types/ResultClass"
import generateResultClassHandlerParams from "../../../../tests/helpers/generateResultClassHandlerParams"
import checkRccSegmentApplicability, { RccSegmentApplicability } from "../checkRccSegmentApplicability"
import hasUnmatchedPncOffences from "../hasUnmatchedPncOffences"
import { handleAdjournmentWithJudgement } from "./handleAdjournmentWithJudgement"

jest.mock("../checkRccSegmentApplicability")
jest.mock("../hasUnmatchedPncOffences")
const mockedCheckRccSegmentApplicability = checkRccSegmentApplicability as jest.Mock
const mockedHasUnmatchedPncOffences = hasUnmatchedPncOffences as jest.Mock

const organisationUnit = {
  TopLevelCode: "A",
  SecondLevelCode: "BC",
  ThirdLevelCode: "DE",
  BottomLevelCode: "FG",
  OrganisationUnitCode: "ABCDEFG"
}

const remandOperation = {
  code: PncOperation.REMAND,
  courtCaseReference: "234",
  data: undefined,
  isAdjournmentPreJudgement: false,
  status: "NotAttempted"
}

describe("handleAdjournmentWithJudgement", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("should return a remand operation when ccrId has value", () => {
    const params = generateResultClassHandlerParams({
      result: {
        NextResultSourceOrganisation: organisationUnit
      } as Result
    })

    const { operations, exceptions } = handleAdjournmentWithJudgement(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      {
        code: PncOperation.NORMAL_DISPOSAL,
        data: {
          courtCaseReference: "234"
        },
        status: "NotAttempted"
      },
      {
        code: PncOperation.REMAND,
        courtCaseReference: "234",
        isAdjournmentPreJudgement: false,
        data: {
          nextHearingDate: undefined,
          nextHearingLocation: organisationUnit
        },
        status: "NotAttempted"
      }
    ])
  })

  it("should return PENHRG operation when fixedPenalty is true", () => {
    const params = generateResultClassHandlerParams({ fixedPenalty: true })

    const { operations, exceptions } = handleAdjournmentWithJudgement(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      { code: PncOperation.PENALTY_HEARING, data: { courtCaseReference: "234" }, status: "NotAttempted" },
      remandOperation
    ])
  })

  it("should return SUBVAR operation when adjudication exists", () => {
    const params = generateResultClassHandlerParams({
      fixedPenalty: false,
      resubmitted: true,
      result: { ResultClass: ResultClass.ADJOURNMENT_WITH_JUDGEMENT, PNCAdjudicationExists: true } as Result
    })

    const { operations, exceptions } = handleAdjournmentWithJudgement(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      { code: PncOperation.DISPOSAL_UPDATED, data: { courtCaseReference: "234" }, status: "NotAttempted" },
      remandOperation
    ])
  })

  it("should only return HO200124 when HO200124 and HO200108 conditions are met", () => {
    const params = generateResultClassHandlerParams({ result: { PNCDisposalType: 2060 } as Result })
    mockedCheckRccSegmentApplicability.mockReturnValue(
      RccSegmentApplicability.CaseRequiresRccButHasNoReportableOffences
    )
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const { operations, exceptions } = handleAdjournmentWithJudgement(params)

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
    expect(operations).toStrictEqual([remandOperation])
  })

  it("should return HO200108 when HO200124 condition is not met and case requires RCC and has no reportable offences", () => {
    const params = generateResultClassHandlerParams({
      result: { PNCDisposalType: 2060 } as Result,
      allResultsAlreadyOnPnc: true
    })
    mockedCheckRccSegmentApplicability.mockReturnValue(
      RccSegmentApplicability.CaseRequiresRccButHasNoReportableOffences
    )
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const { operations, exceptions } = handleAdjournmentWithJudgement(params)

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
      { code: PncOperation.NORMAL_DISPOSAL, data: { courtCaseReference: "234" }, status: "NotAttempted" },
      remandOperation
    ])
  })

  it("should not return HO200124 when all results are already on PNC", () => {
    const params = generateResultClassHandlerParams({ allResultsAlreadyOnPnc: true })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const { operations, exceptions } = handleAdjournmentWithJudgement(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      { code: PncOperation.NORMAL_DISPOSAL, data: { courtCaseReference: "234" }, status: "NotAttempted" },
      remandOperation
    ])
  })

  it("should not return HO200124 when all PNC offences match", () => {
    const params = generateResultClassHandlerParams()
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(false)

    const { operations, exceptions } = handleAdjournmentWithJudgement(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      { code: PncOperation.NORMAL_DISPOSAL, data: { courtCaseReference: "234" }, status: "NotAttempted" },
      remandOperation
    ])
  })

  it("should not return HO200124 when case is added by the court", () => {
    const params = generateResultClassHandlerParams({
      offence: { AddedByTheCourt: true, Result: [{ PNCDisposalType: 4000 }] } as Offence
    })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const { operations, exceptions } = handleAdjournmentWithJudgement(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      {
        code: PncOperation.NORMAL_DISPOSAL,
        data: { courtCaseReference: "234" },
        addedByTheCourt: true,
        status: "NotAttempted"
      },
      remandOperation
    ])
  })

  it("should return DISARR operation when result does not meet HO200124 and HO200108 conditions and offence is not added by the court", () => {
    const params = generateResultClassHandlerParams({
      offence: { AddedByTheCourt: false, Result: [{ PNCDisposalType: 4000 }] } as Offence,
      allResultsAlreadyOnPnc: true
    })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const { operations, exceptions } = handleAdjournmentWithJudgement(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      { code: PncOperation.NORMAL_DISPOSAL, data: { courtCaseReference: "234" }, status: "NotAttempted" },
      remandOperation
    ])
  })

  it("should return OAAC DISARR operation when result does not meet HO200124 and HO200108 conditions and offence is added by the court and offence does not have a 2007 result code", () => {
    const params = generateResultClassHandlerParams({
      offence: { AddedByTheCourt: true, Result: [{ PNCDisposalType: 4000 }] } as Offence,
      allResultsAlreadyOnPnc: true
    })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const { operations, exceptions } = handleAdjournmentWithJudgement(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      {
        code: PncOperation.NORMAL_DISPOSAL,
        data: { courtCaseReference: "234" },
        addedByTheCourt: true,
        status: "NotAttempted"
      },
      remandOperation
    ])
  })

  it("should not return OAAC DISARR operation when result does not meet HO200124 and HO200108 conditions and offence is added by the court but offence has a 2007 result code", () => {
    const params = generateResultClassHandlerParams({
      offence: { AddedByTheCourt: true, Result: [{ PNCDisposalType: 2007 }] } as Offence,
      allResultsAlreadyOnPnc: true
    })
    mockedCheckRccSegmentApplicability.mockReturnValue(RccSegmentApplicability.CaseDoesNotRequireRcc)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const { operations, exceptions } = handleAdjournmentWithJudgement(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([remandOperation])
  })
})
