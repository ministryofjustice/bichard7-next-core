import type { Result } from "../../../../types/AnnotatedHearingOutcome"
import { PncOperation } from "../../../../types/PncOperation"
import ResultClass from "../../../../types/ResultClass"
import generateResultClassHandlerParams from "../../../tests/helpers/generateResultClassHandlerParams"
import { handleAdjournmentPreJudgement } from "./handleAdjournmentPreJudgement"

const organisationUnit = {
  TopLevelCode: "A",
  SecondLevelCode: "BC",
  ThirdLevelCode: "DE",
  BottomLevelCode: "FG",
  OrganisationUnitCode: "ABCDEFG"
}

describe("handleAdjournmentPreJudgement", () => {
  it("should return remand operations with isAdjournmentPreJudgement in operation data when adjudication does not exist and ccrId has value", () => {
    const params = generateResultClassHandlerParams({
      result: {
        PNCAdjudicationExists: false,
        ResultClass: ResultClass.ADJOURNMENT_PRE_JUDGEMENT,
        NextResultSourceOrganisation: organisationUnit
      } as Result
    })

    const { operations, exceptions } = handleAdjournmentPreJudgement(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      {
        code: PncOperation.REMAND,
        isAdjournmentPreJudgement: true,
        courtCaseReference: "234",
        data: {
          nextHearingDate: undefined,
          nextHearingLocation: organisationUnit
        },
        status: "NotAttempted"
      }
    ])
  })
})
