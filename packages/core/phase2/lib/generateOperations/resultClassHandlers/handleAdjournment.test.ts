import type { Result } from "../../../../types/AnnotatedHearingOutcome"

import { PncOperation } from "../../../../types/PncOperation"
import generateResultClassHandlerParams from "../../../tests/helpers/generateResultClassHandlerParams"
import { handleAdjournment } from "./handleAdjournment"

const organisationUnit = {
  BottomLevelCode: "FG",
  OrganisationUnitCode: "ABCDEFG",
  SecondLevelCode: "BC",
  ThirdLevelCode: "DE",
  TopLevelCode: "A"
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
        data: {
          nextHearingDate: undefined,
          nextHearingLocation: organisationUnit
        },
        isAdjournmentPreJudgement: false,
        status: "NotAttempted"
      }
    ])
  })
})
