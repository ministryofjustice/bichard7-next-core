import type { Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import { PncOperation } from "@moj-bichard7/common/types/PncOperation"

import generateResultClassHandlerParams from "../../../tests/helpers/generateResultClassHandlerParams"
import { handleAdjournment } from "./handleAdjournment"

const organisationUnit = {
  TopLevelCode: "A",
  SecondLevelCode: "BC",
  ThirdLevelCode: "DE",
  BottomLevelCode: "FG",
  OrganisationUnitCode: "ABCDEFG"
}

describe("handleAdjournment", () => {
  it("should return remand operation with court case reference", () => {
    const params = generateResultClassHandlerParams({
      result: { NextResultSourceOrganisation: organisationUnit } as Result
    })

    const operations = handleAdjournment(params)

    expect(operations).toStrictEqual([
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
})
