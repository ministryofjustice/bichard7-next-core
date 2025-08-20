import type { Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import { PncOperation } from "@moj-bichard7/common/types/PncOperation"

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
  it("returns remand operations with court case reference in operation data when PNC adjudication and court case reference exists", () => {
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

  it("returns no operations when PNC adjudication does not exist", () => {
    const params = generateResultClassHandlerParams({
      result: { PNCAdjudicationExists: false, NextResultSourceOrganisation: organisationUnit } as Result
    })

    const operations = handleAdjournmentPostJudgement(params)

    expect(operations).toHaveLength(0)
  })
})
