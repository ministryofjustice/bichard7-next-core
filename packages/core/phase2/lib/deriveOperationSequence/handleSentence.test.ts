jest.mock("../../addRemandOperation")
jest.mock("../../addNewOperationToOperationSetIfNotPresent")
jest.mock("./addSubsequentVariationOperations")
jest.mock("./areAnyPncResults2007")
import type { Offence } from "../../../types/AnnotatedHearingOutcome"
import DocumentType from "../../../types/DocumentType"
import { ExceptionCode } from "../../../types/ExceptionCode"
import addNewOperationToOperationSetIfNotPresent from "../../addNewOperationToOperationSetIfNotPresent"
import addSubsequentVariationOperations from "./addSubsequentVariationOperations"
import areAnyPncResults2007 from "./areAnyPncResults2007"
import type { ResultClassHandlerParams } from "./deriveOperationSequence"
import { handleSentence } from "./handleSentence"
;(addNewOperationToOperationSetIfNotPresent as jest.Mock).mockImplementation(() => {})
;(addSubsequentVariationOperations as jest.Mock).mockImplementation(() => {})
const mockedAreAnyPncResults2007 = areAnyPncResults2007 as jest.Mock

const generateParams = (overrides: Partial<ResultClassHandlerParams> = {}, documentType = DocumentType.SpiResult) =>
  structuredClone({
    aho: {
      Exceptions: [],
      AnnotatedHearingOutcome: { HearingOutcome: { Hearing: { SourceReference: { DocumentType: documentType } } } }
    },
    adjudicationExists: false,
    operations: [{ dummy: "Main Operations" }],
    fixedPenalty: false,
    ccrId: "654",
    resubmitted: false,
    allResultsAlreadyOnPnc: false,
    offence: { AddedByTheCourt: false },
    offenceIndex: 1,
    resultIndex: 1,
    ...overrides
  }) as unknown as ResultClassHandlerParams

describe("handleSentence", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("should add PENHRG operation when fixedPenalty is true and ccrId has value", () => {
    const params = generateParams({ fixedPenalty: true })

    handleSentence(params)

    expect(params.aho.Exceptions).toHaveLength(0)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(1)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledWith("PENHRG", { courtCaseReference: "654" }, [
      { dummy: "Main Operations" }
    ])
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(0)
  })

  it("should add PENHRG operation when fixedPenalty is true and ccrId does not have value", () => {
    const params = generateParams({ fixedPenalty: true, ccrId: undefined })

    handleSentence(params)

    expect(params.aho.Exceptions).toHaveLength(0)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(1)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledWith("PENHRG", undefined, [
      { dummy: "Main Operations" }
    ])
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(0)
  })

  it("should add COMSEN operation when adjudication exists, document type is Committal Record Sheet, and ccrId has value", () => {
    const params = generateParams({ fixedPenalty: false, adjudicationExists: true }, DocumentType.CommittalRecordSheet)

    handleSentence(params)

    expect(params.aho.Exceptions).toHaveLength(0)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(1)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledWith("COMSEN", { courtCaseReference: "654" }, [
      { dummy: "Main Operations" }
    ])
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(0)
  })

  it("should add COMSEN operation when adjudication exists, document type is Committal Record Sheet, and ccrId does not have value", () => {
    const params = generateParams(
      { fixedPenalty: false, adjudicationExists: true, ccrId: undefined },
      DocumentType.CommittalRecordSheet
    )

    handleSentence(params)

    expect(params.aho.Exceptions).toHaveLength(0)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(1)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledWith("COMSEN", undefined, [
      { dummy: "Main Operations" }
    ])
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(0)
  })

  it("should add SENDEF operation when adjudication exists, document type is SPI, result is associated with an offence, there are no 2007 result code, and ccrId has value", () => {
    const params = generateParams({ fixedPenalty: false, adjudicationExists: true }, DocumentType.SpiResult)
    mockedAreAnyPncResults2007.mockReturnValue(false)

    handleSentence(params)

    expect(params.aho.Exceptions).toHaveLength(0)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(1)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledWith("SENDEF", { courtCaseReference: "654" }, [
      { dummy: "Main Operations" }
    ])
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(0)
  })

  it("should add SENDEF operation when adjudication exists, document type is SPI, result is associated with an offence, there are no 2007 result code, and ccrId does not have value", () => {
    const params = generateParams(
      { fixedPenalty: false, adjudicationExists: true, ccrId: undefined },
      DocumentType.SpiResult
    )
    mockedAreAnyPncResults2007.mockReturnValue(false)

    handleSentence(params)

    expect(params.aho.Exceptions).toHaveLength(0)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(1)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledWith("SENDEF", undefined, [
      { dummy: "Main Operations" }
    ])
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(0)
  })

  it("should add SUBVAR operation when adjudication exists, document type is SPI, result is associated with an offence, and there is a 2007 result code", () => {
    const params = generateParams(
      { fixedPenalty: false, adjudicationExists: true, offence: {} as Offence, offenceIndex: 1, resultIndex: 1 },
      DocumentType.SpiResult
    )
    mockedAreAnyPncResults2007.mockReturnValue(true)

    handleSentence(params)

    expect(params.aho.Exceptions).toHaveLength(0)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(0)
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(1)
    expect(addSubsequentVariationOperations).toHaveBeenCalledWith(
      false,
      [{ dummy: "Main Operations" }],
      {
        Exceptions: [],
        AnnotatedHearingOutcome: {
          HearingOutcome: { Hearing: { SourceReference: { DocumentType: DocumentType.SpiResult } } }
        }
      },
      ExceptionCode.HO200104,
      false,
      1,
      1,
      { courtCaseReference: "654" }
    )
  })

  it("should add SUBVAR operation without operation data when adjudication exists, document type is SPI, result is associated with an offence, there is a 2007 result code, and ccrId is not set", () => {
    const params = generateParams(
      {
        fixedPenalty: false,
        adjudicationExists: true,
        ccrId: undefined,
        offence: {} as Offence,
        offenceIndex: 1,
        resultIndex: 1
      },
      DocumentType.SpiResult
    )
    mockedAreAnyPncResults2007.mockReturnValue(true)

    handleSentence(params)

    expect(params.aho.Exceptions).toHaveLength(0)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(0)
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(1)
    expect(addSubsequentVariationOperations).toHaveBeenCalledWith(
      false,
      [{ dummy: "Main Operations" }],
      {
        Exceptions: [],
        AnnotatedHearingOutcome: {
          HearingOutcome: { Hearing: { SourceReference: { DocumentType: DocumentType.SpiResult } } }
        }
      },
      ExceptionCode.HO200104,
      false,
      1,
      1,
      undefined
    )
  })

  it("should generate HO200106 when document type is neither Committal Record Sheet or SPI", () => {
    const params = generateParams(
      { fixedPenalty: false, adjudicationExists: true, offence: {} as Offence, offenceIndex: 1, resultIndex: 1 },
      "Dummy" as DocumentType
    )

    handleSentence(params)

    expect(params.aho.Exceptions).toStrictEqual([
      {
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
      }
    ])
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(0)
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(0)
  })

  it("should do nothing when fixedPenalty is false and adjudication does not exist", () => {
    const params = generateParams({ fixedPenalty: false, adjudicationExists: false }, "Dummy" as DocumentType)

    handleSentence(params)

    expect(params.aho.Exceptions).toHaveLength(0)
    expect(addNewOperationToOperationSetIfNotPresent).toHaveBeenCalledTimes(0)
    expect(addSubsequentVariationOperations).toHaveBeenCalledTimes(0)
  })
})
