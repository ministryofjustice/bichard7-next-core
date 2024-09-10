import type { Result } from "../../../../../types/AnnotatedHearingOutcome"
import generateResultClassHandlerParams from "../../../../tests/helpers/generateResultClassHandlerParams"
import { PNCMessageType } from "../../../../../types/operationCodes"
import { handleAdjournment } from "./handleAdjournment"

const organisationUnit = {
  TopLevelCode: "A",
  SecondLevelCode: "BC",
  ThirdLevelCode: "DE",
  BottomLevelCode: "FG",
  OrganisationUnitCode: "ABCDEFG"
}

describe("handleAdjournment", () => {
  it("should return remand operation with ccrId", () => {
    const params = generateResultClassHandlerParams({
      result: { NextResultSourceOrganisation: organisationUnit } as Result
    })

    const { operations, exceptions } = handleAdjournment(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      {
        code: PNCMessageType.REMAND,
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
