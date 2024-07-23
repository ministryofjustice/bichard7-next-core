import type { Offence } from "../../../../../types/AnnotatedHearingOutcome"
import generateResultClassHandlerParams from "../../../../tests/helpers/generateResultClassHandlerParams"
import addRemandOperation from "../../../addRemandOperation"
import { handleAdjournment } from "./handleAdjournment"

jest.mock("../../../addRemandOperation")
;(addRemandOperation as jest.Mock).mockImplementation(() => {})

describe("handleAdjournment", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("should call addRemandOperation and add the ccrId to remandCcrs", () => {
    const params = generateResultClassHandlerParams()

    handleAdjournment(params)

    expect(addRemandOperation).toHaveBeenCalledTimes(1)
  })

  it("should call addRemandOperation and should not add the ccrId to remandCcrs", () => {
    const params = generateResultClassHandlerParams({
      offence: {
        CourtCaseReferenceNumber: undefined
      } as Offence
    })

    handleAdjournment(params)

    expect(addRemandOperation).toHaveBeenCalledTimes(1)
  })
})
