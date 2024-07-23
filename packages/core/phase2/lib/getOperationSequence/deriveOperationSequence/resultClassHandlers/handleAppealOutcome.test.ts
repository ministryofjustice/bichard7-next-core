import type { Offence, Result } from "../../../../../types/AnnotatedHearingOutcome";
import generateResultClassHandlerParams from "../../../../tests/helpers/generateResultClassHandlerParams";
import createOperation from "../../../createOperation";
import { handleAppealOutcome } from "./handleAppealOutcome";

jest.mock("../../../createOperation")
;(createOperation as jest.Mock).mockImplementation(() => {})

describe("handleAppealOutcome", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("should add APPHRD to operations and set ccrId in operation data when adjudication exists and ccrId has value", () => {
    const params = generateResultClassHandlerParams({ result: { PNCAdjudicationExists: true } as Result })

    const exception = handleAppealOutcome(params)

    expect(exception).toBeUndefined()
    expect(createOperation).toHaveBeenCalledTimes(1)
    expect(createOperation).toHaveBeenCalledWith("APPHRD", { courtCaseReference: "234" }, [
      { dummy: "Main Operations" }
    ])
  })

  it("should add APPHRD to operations and operation data to undefined when adjudication exists but ccrId does not have value", () => {
    const params = generateResultClassHandlerParams({
      result: { PNCAdjudicationExists: true } as Result,
      offence: {
        CourtCaseReferenceNumber: undefined
      } as Offence
    })

    const exception = handleAppealOutcome(params)

    expect(exception).toBeUndefined()
    expect(createOperation).toHaveBeenCalledTimes(1)
    expect(createOperation).toHaveBeenCalledWith("APPHRD", undefined, [
      { dummy: "Main Operations" }
    ])
  })

  it("should generate exception HO200107 when adjudication does not exist", () => {
    const params = generateResultClassHandlerParams({ result: { PNCAdjudicationExists: false } as Result })

    const exception = handleAppealOutcome(params)

    expect(createOperation).toHaveBeenCalledTimes(0)
    expect(exception).toStrictEqual({
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
    })
  })
})
