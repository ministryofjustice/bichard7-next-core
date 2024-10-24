import type { Offence, Result } from "../../../../types/AnnotatedHearingOutcome"
import { PncOperation } from "../../../../types/PncOperation"
import ResultClass from "../../../../types/ResultClass"
import generateResultClassHandlerParams from "../../../tests/helpers/generateResultClassHandlerParams"
import { areAllResultsOnPnc } from "../areAllResultsOnPnc"
import hasUnmatchedPncOffences from "../hasUnmatchedPncOffences"
import { handleAdjournmentWithJudgement } from "./handleAdjournmentWithJudgement"

jest.mock("../hasUnmatchedPncOffences")
jest.mock("../areAllResultsOnPnc")

const mockedHasUnmatchedPncOffences = hasUnmatchedPncOffences as jest.Mock
const mockedAreAllResultsOnPnc = areAllResultsOnPnc as jest.Mock

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

    const operations = handleAdjournmentWithJudgement(params)

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

    const operations = handleAdjournmentWithJudgement(params)

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

    const operations = handleAdjournmentWithJudgement(params)

    expect(operations).toStrictEqual([
      { code: PncOperation.DISPOSAL_UPDATED, data: { courtCaseReference: "234" }, status: "NotAttempted" },
      remandOperation
    ])
  })

  it("should return DISARR operation when result does not meet HO200124 and HO200108 conditions and offence is not added by the court", () => {
    const params = generateResultClassHandlerParams({
      offence: { AddedByTheCourt: false, Result: [{ PNCDisposalType: 4000 }] } as Offence,
      areAllResultsOnPnc: true
    })
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const operations = handleAdjournmentWithJudgement(params)

    expect(operations).toStrictEqual([
      { code: PncOperation.NORMAL_DISPOSAL, data: { courtCaseReference: "234" }, status: "NotAttempted" },
      remandOperation
    ])
  })

  it("should return OAAC DISARR operation when result does not meet HO200124 and HO200108 conditions and offence is added by the court and offence does not have a 2007 result code", () => {
    const params = generateResultClassHandlerParams({
      offence: { AddedByTheCourt: true, Result: [{ PNCDisposalType: 4000 }] } as Offence,
      areAllResultsOnPnc: true
    })
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const operations = handleAdjournmentWithJudgement(params)

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
      areAllResultsOnPnc: true
    })
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const operations = handleAdjournmentWithJudgement(params)

    expect(operations).toStrictEqual([remandOperation])
  })

  it("should return only a remand operation when results are not on PNC, there are unmatched PNC offences, and the offence is not added by the court", () => {
    const params = generateResultClassHandlerParams({ result: { PNCDisposalType: 2060 } as Result })
    mockedAreAllResultsOnPnc.mockReturnValue(false)
    mockedHasUnmatchedPncOffences.mockReturnValue(true)

    const operations = handleAdjournmentWithJudgement(params)

    expect(operations).toStrictEqual([remandOperation])
  })
})
