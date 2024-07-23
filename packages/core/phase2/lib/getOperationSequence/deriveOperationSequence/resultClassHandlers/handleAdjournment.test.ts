import type { Offence } from "../../../../../types/AnnotatedHearingOutcome";
import generateResultClassHandlerParams from "../../../../tests/helpers/generateResultClassHandlerParams";
import createRemandOperation from "../../../createRemandOperation";
import { handleAdjournment } from "./handleAdjournment";

jest.mock("../../../createRemandOperation.test")
;(createRemandOperation as jest.Mock).mockImplementation(() => {})

describe("handleAdjournment", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("should call createRemandOperation.test and add the ccrId to remandCcrs", () => {
    const params = generateResultClassHandlerParams()

    handleAdjournment(params)

    expect(createRemandOperation).toHaveBeenCalledTimes(1)
  })

  it("should call createRemandOperation.test and should not add the ccrId to remandCcrs", () => {
    const params = generateResultClassHandlerParams({
      offence: {
        CourtCaseReferenceNumber: undefined
      } as Offence
    })

    handleAdjournment(params)

    expect(createRemandOperation).toHaveBeenCalledTimes(1)
  })
})
