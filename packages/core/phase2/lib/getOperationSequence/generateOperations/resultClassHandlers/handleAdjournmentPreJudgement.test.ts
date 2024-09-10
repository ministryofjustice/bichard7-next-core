import type { Result } from "../../../../../types/AnnotatedHearingOutcome"
import ResultClass from "../../../../../types/ResultClass"
import generateResultClassHandlerParams from "../../../../tests/helpers/generateResultClassHandlerParams"
import { PNCMessageType } from "../../../../../types/operationCodes"
import { handleAdjournmentPreJudgement } from "./handleAdjournmentPreJudgement"

const organisationUnit = {
  TopLevelCode: "A",
  SecondLevelCode: "BC",
  ThirdLevelCode: "DE",
  BottomLevelCode: "FG",
  OrganisationUnitCode: "ABCDEFG"
}

describe("handleAdjournmentPreJudgement", () => {
  it("should return HO200100 when adjudication exists", () => {
    const params = generateResultClassHandlerParams({ result: { PNCAdjudicationExists: true } as Result })

    const { operations, exceptions } = handleAdjournmentPreJudgement(params)

    expect(exceptions).toStrictEqual([
      {
        code: "HO200100",
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
        code: PNCMessageType.REMAND,
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
