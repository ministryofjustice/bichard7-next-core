import type { Result } from "../../../../types/AnnotatedHearingOutcome"

import { PncOperation } from "../../../../types/PncOperation"
import generateResultClassHandlerParams from "../../../tests/helpers/generateResultClassHandlerParams"
import { handleAdjournmentPostJudgement } from "./handleAdjournmentPostJudgement"

const organisationUnit = {
  BottomLevelCode: "FG",
  OrganisationUnitCode: "ABCDEFG",
  SecondLevelCode: "BC",
  ThirdLevelCode: "DE",
  TopLevelCode: "A"
}

describe("handleAdjournmentPostJudgement", () => {
  it("returns remand operations with court case reference in operation data when PNC adjudication and court case reference exists", () => {
    const params = generateResultClassHandlerParams({
      result: { NextResultSourceOrganisation: organisationUnit, PNCAdjudicationExists: true } as Result
    })

    const operations = handleAdjournmentPostJudgement(params)

    expect(operations).toStrictEqual([
      {
        code: PncOperation.REMAND,
        courtCaseReference: "234",
        data: {
          nextHearingDate: undefined,
          nextHearingLocation: organisationUnit
        },
        isAdjournmentPreJudgement: false,
        status: "NotAttempted"
      }
    ])
  })

  it("returns no operations when PNC adjudication does not exist", () => {
    const params = generateResultClassHandlerParams({
      result: { NextResultSourceOrganisation: organisationUnit, PNCAdjudicationExists: false } as Result
    })

    const operations = handleAdjournmentPostJudgement(params)

    expect(operations).toHaveLength(0)
  })
})
