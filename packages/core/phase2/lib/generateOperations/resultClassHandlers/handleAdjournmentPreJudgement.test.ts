import type { Result } from "../../../../types/AnnotatedHearingOutcome"

import { PncOperation } from "../../../../types/PncOperation"
import ResultClass from "../../../../types/ResultClass"
import generateResultClassHandlerParams from "../../../tests/helpers/generateResultClassHandlerParams"
import { handleAdjournmentPreJudgement } from "./handleAdjournmentPreJudgement"

const organisationUnit = {
  BottomLevelCode: "FG",
  OrganisationUnitCode: "ABCDEFG",
  SecondLevelCode: "BC",
  ThirdLevelCode: "DE",
  TopLevelCode: "A"
}

describe("handleAdjournmentPreJudgement", () => {
  it("returns remand operations with isAdjournmentPreJudgement in operation data when PNC adjudication doesn't exist and court case reference exists", () => {
    const params = generateResultClassHandlerParams({
      result: {
        NextResultSourceOrganisation: organisationUnit,
        PNCAdjudicationExists: false,
        ResultClass: ResultClass.ADJOURNMENT_PRE_JUDGEMENT
      } as Result
    })

    const operations = handleAdjournmentPreJudgement(params)

    expect(operations).toStrictEqual([
      {
        code: PncOperation.REMAND,
        courtCaseReference: "234",
        data: {
          nextHearingDate: undefined,
          nextHearingLocation: organisationUnit
        },
        isAdjournmentPreJudgement: true,
        status: "NotAttempted"
      }
    ])
  })
})
