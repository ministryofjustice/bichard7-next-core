import type { Offence, Result } from "../../../../../types/AnnotatedHearingOutcome"
import generateResultClassHandlerParams from "../../../../tests/helpers/generateResultClassHandlerParams"
import { handleAppealOutcome } from "./handleAppealOutcome"

describe("handleAppealOutcome", () => {
  it("should add APPHRD to operations and set ccrId in operation data when adjudication exists and ccrId has value", () => {
    const params = generateResultClassHandlerParams({ result: { PNCAdjudicationExists: true } as Result })

    const { operations, exceptions } = handleAppealOutcome(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([{ code: "APPHRD", data: { courtCaseReference: "234" }, status: "NotAttempted" }])
  })

  it("should add APPHRD to operations and operation data to undefined when adjudication exists but ccrId does not have value", () => {
    const params = generateResultClassHandlerParams({
      result: { PNCAdjudicationExists: true } as Result,
      offence: {
        CourtCaseReferenceNumber: undefined
      } as Offence
    })

    const { operations, exceptions } = handleAppealOutcome(params)

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([{ code: "APPHRD", data: undefined, status: "NotAttempted" }])
  })

  it("should generate exception HO200107 when adjudication does not exist", () => {
    const params = generateResultClassHandlerParams({ result: { PNCAdjudicationExists: false } as Result })

    const { operations, exceptions } = handleAppealOutcome(params)

    expect(operations).toHaveLength(0)
    expect(exceptions).toStrictEqual([
      {
        code: "HO200107",
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
  })
})
