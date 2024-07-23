import type { Offence, Result } from "../../../../../types/AnnotatedHearingOutcome"
import generateResultClassHandlerParams from "../../../../tests/helpers/generateResultClassHandlerParams"
import { handleAdjournmentPostJudgement } from "./handleAdjournmentPostJudgement"

const organisationUnit = {
  TopLevelCode: "A",
  SecondLevelCode: "BC",
  ThirdLevelCode: "DE",
  BottomLevelCode: "FG",
  OrganisationUnitCode: "ABCDEFG"
}

describe("handleAdjournmentPostJudgement", () => {
  it("should return remand operations with ccrId in operation data when adjudication exists and ccrId has value", () => {
    const params = generateResultClassHandlerParams({
      result: { PNCAdjudicationExists: true, NextResultSourceOrganisation: organisationUnit } as Result
    })

    const { operations, exceptions } = handleAdjournmentPostJudgement(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      {
        code: "NEWREM",
        status: "NotAttempted",
        data: {
          courtCaseReference: "234",
          isAdjournmentPreJudgement: false,
          nextHearingDate: undefined,
          nextHearingLocation: organisationUnit
        }
      }
    ])
  })

  it("should return HO200103 when adjudication does not exists and result is not added by court", () => {
    const params = generateResultClassHandlerParams({
      result: { PNCAdjudicationExists: false } as Result,
      offence: { AddedByTheCourt: false } as Offence,
      offenceIndex: 1
    })

    const { operations, exceptions } = handleAdjournmentPostJudgement(params)

    expect(exceptions).toStrictEqual([
      {
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
      }
    ])
    expect(operations).toHaveLength(0)
  })

  it("should not return HO200103 when adjudication does not exists and result is added by court", () => {
    const params = generateResultClassHandlerParams({
      result: { PNCAdjudicationExists: false } as Result,
      offence: { AddedByTheCourt: true } as Offence,
      offenceIndex: 1
    })

    const { operations, exceptions } = handleAdjournmentPostJudgement(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toHaveLength(0)
  })
})
