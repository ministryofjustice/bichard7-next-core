import type { Result } from "../../../../types/AnnotatedHearingOutcome"
import { PncOperation } from "../../../../types/PncOperation"
import generateResultClassHandlerParams from "../../../tests/helpers/generateResultClassHandlerParams"
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

    const operations = handleAdjournmentPostJudgement(params)

    expect(operations).toStrictEqual([
      {
        code: PncOperation.REMAND,
        status: "NotAttempted",
        courtCaseReference: "234",
        isAdjournmentPreJudgement: false,
        data: {
          nextHearingDate: undefined,
          nextHearingLocation: organisationUnit
        }
      }
    ])
  })

  it("should not return remand operations when adjudication does not exist", () => {
    const params = generateResultClassHandlerParams({
      result: { PNCAdjudicationExists: false, NextResultSourceOrganisation: organisationUnit } as Result
    })

    const operations = handleAdjournmentPostJudgement(params)

    expect(operations).toHaveLength(0)
  })
})
