jest.mock("../../addNewOperationToOperationSetIfNotPresent")
import addNewOperationToOperationSetIfNotPresent from "../../addNewOperationToOperationSetIfNotPresent"
import type { ResultClassHandlerParams } from "./deriveOperationSequence"
import { handleAppealOutcome } from "./handleAppealOutcome"
;(addNewOperationToOperationSetIfNotPresent as jest.Mock).mockImplementation(() => {})

const generateParams = (overrides: Partial<ResultClassHandlerParams> = {}) =>
  structuredClone({
    aho: { Exceptions: [] },
    adjudicationExists: false,
    operations: [{ dummy: "Main Operations" }],
    ccrId: "234",
    offenceIndex: 1,
    resultIndex: 1,
    ...overrides
  }) as unknown as ResultClassHandlerParams

describe("handleAppealOutcome", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("should add APPHRD to operations and set ccrId in operation data when adjudication exists and ccrId has value", () => {
    const params = generateParams({ adjudicationExists: true, ccrId: "456" })

    handleAppealOutcome(params)

    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(1)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledWith("APPHRD", { courtCaseReference: "456" }, [
      { dummy: "Main Operations" }
    ])
  })

  it("should add APPHRD to operations and operation data to undefined when adjudication exists but ccrId does not have value", () => {
    const params = generateParams({ adjudicationExists: true, ccrId: undefined })

    handleAppealOutcome(params)

    expect(params.aho.Exceptions).toHaveLength(0)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(1)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledWith("APPHRD", undefined, [
      { dummy: "Main Operations" }
    ])
  })

  it("should generate exception HO200107 when adjudication does not exist", () => {
    const params = generateParams({ adjudicationExists: false })

    handleAppealOutcome(params)

    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(0)
    expect(params.aho.Exceptions).toStrictEqual([
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
