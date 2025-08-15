import type { Result } from "../../../../types/AnnotatedHearingOutcome"

import ResultClass from "@moj-bichard7/common/types/ResultClass"
import { PncOperation } from "../../../../types/PncOperation"
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
  it("returns remand operations with isAdjournmentPreJudgement in operation data when PNC adjudication doesn't exist and court case reference exists", () => {
    const params = generateResultClassHandlerParams({
      result: {
        PNCAdjudicationExists: false,
        ResultClass: ResultClass.ADJOURNMENT_PRE_JUDGEMENT,
        NextResultSourceOrganisation: organisationUnit
      } as Result
    })

    const operations = handleAdjournmentPreJudgement(params)

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
