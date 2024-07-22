import generateResultClassHandlerParams from "../../../../tests/helpers/generateResultClassHandlerParams"
import addNewOperationToOperationSetIfNotPresent from "../../../addNewOperationToOperationSetIfNotPresent"
import { handleAppealOutcome } from "./handleAppealOutcome"
import type { Offence, Result } from "../../../../../types/AnnotatedHearingOutcome"

jest.mock("../../../addNewOperationToOperationSetIfNotPresent")
;(addNewOperationToOperationSetIfNotPresent as jest.Mock).mockImplementation(() => {})

describe("handleAppealOutcome", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("should add APPHRD to operations and set ccrId in operation data when adjudication exists and ccrId has value", () => {
    const params = generateResultClassHandlerParams({ result: { PNCAdjudicationExists: true } as Result })

    const exception = handleAppealOutcome(params)

    expect(exception).toBeUndefined()
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(1)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledWith("APPHRD", { courtCaseReference: "234" }, [
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
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(1)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledWith("APPHRD", undefined, [
      { dummy: "Main Operations" }
    ])
  })

  it("should generate exception HO200107 when adjudication does not exist", () => {
    const params = generateResultClassHandlerParams({ result: { PNCAdjudicationExists: false } as Result })

    const exception = handleAppealOutcome(params)

    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(0)
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
