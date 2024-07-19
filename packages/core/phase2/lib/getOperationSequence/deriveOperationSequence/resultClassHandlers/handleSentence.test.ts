import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import addNewOperationToOperationSetIfNotPresent from "../../../addNewOperationToOperationSetIfNotPresent"
import addSubsequentVariationOperations from "../addSubsequentVariationOperations"
import areAnyPncResults2007 from "../areAnyPncResults2007"
import { handleSentence } from "./handleSentence"
import type { Offence } from "../../../../../types/AnnotatedHearingOutcome"
import generateResultClassHandlerParams from "../../../../tests/helpers/generateResultClassHandlerParams"

jest.mock("../../../addNewOperationToOperationSetIfNotPresent")
jest.mock("../addSubsequentVariationOperations")
jest.mock("../areAnyPncResults2007")
;(addNewOperationToOperationSetIfNotPresent as jest.Mock).mockImplementation(() => {})
;(addSubsequentVariationOperations as jest.Mock).mockImplementation(() => {})
const mockedAreAnyPncResults2007 = areAnyPncResults2007 as jest.Mock

describe("handleSentence", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("should add PENHRG operation when fixedPenalty is true and ccrId has value", () => {
    const params = generateResultClassHandlerParams({ fixedPenalty: true })

    const exception = handleSentence(params)

    expect(exception).toBeUndefined()
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(1)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledWith("PENHRG", { courtCaseReference: "234" }, [
      { dummy: "Main Operations" }
    ])
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(0)
  })

  it("should add PENHRG operation when fixedPenalty is true and ccrId does not have value", () => {
    const params = generateResultClassHandlerParams({ fixedPenalty: true, ccrId: undefined })

    const exception = handleSentence(params)

    expect(exception).toBeUndefined()
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(1)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledWith("PENHRG", undefined, [
      { dummy: "Main Operations" }
    ])
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(0)
  })

  it("should add SENDEF operation when adjudication exists, there are no 2007 result code, and ccrId has value", () => {
    const params = generateResultClassHandlerParams({ fixedPenalty: false, adjudicationExists: true })
    mockedAreAnyPncResults2007.mockReturnValue(false)

    const exception = handleSentence(params)

    expect(exception).toBeUndefined()
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(1)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledWith("SENDEF", { courtCaseReference: "234" }, [
      { dummy: "Main Operations" }
    ])
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(0)
  })

  it("should add SENDEF operation when adjudication exists, there are no 2007 result code, and ccrId does not have value", () => {
    const params = generateResultClassHandlerParams({ fixedPenalty: false, adjudicationExists: true, ccrId: undefined })
    mockedAreAnyPncResults2007.mockReturnValue(false)

    const exception = handleSentence(params)

    expect(exception).toBeUndefined()
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(1)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledWith("SENDEF", undefined, [
      { dummy: "Main Operations" }
    ])
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(0)
  })

  it("should add SUBVAR operation when adjudication exists, and there is a 2007 result code", () => {
    const params = generateResultClassHandlerParams({
      fixedPenalty: false,
      adjudicationExists: true,
      offence: {} as Offence,
      offenceIndex: 1,
      resultIndex: 1
    })
    mockedAreAnyPncResults2007.mockReturnValue(true)

    const exception = handleSentence(params)

    expect(exception).toBeUndefined()
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(0)
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(1)
    expect(addSubsequentVariationOperations).toHaveBeenCalledWith(
      false,
      [{ dummy: "Main Operations" }],
      params.aho,
      ExceptionCode.HO200104,
      false,
      1,
      1,
      { courtCaseReference: "234" }
    )
  })

  it("should add SUBVAR operation without operation data when adjudication exists, there is a 2007 result code, and ccrId is not set", () => {
    const params = generateResultClassHandlerParams({
      fixedPenalty: false,
      adjudicationExists: true,
      ccrId: undefined,
      offence: {} as Offence,
      offenceIndex: 1,
      resultIndex: 1
    })
    mockedAreAnyPncResults2007.mockReturnValue(true)

    const exception = handleSentence(params)

    expect(exception).toBeUndefined()
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(0)
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(1)
    expect(addSubsequentVariationOperations).toHaveBeenCalledWith(
      false,
      [{ dummy: "Main Operations" }],
      params.aho,
      ExceptionCode.HO200104,
      false,
      1,
      1,
      undefined
    )
  })

  it("should generate HO200106 when adjudication does not exist", () => {
    const params = generateResultClassHandlerParams({
      fixedPenalty: false,
      adjudicationExists: false,
      offence: {} as Offence,
      offenceIndex: 1,
      resultIndex: 1
    })

    const exception = handleSentence(params)

    expect(exception).toStrictEqual({
      code: "HO200106",
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
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(0)
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(0)
  })
})
