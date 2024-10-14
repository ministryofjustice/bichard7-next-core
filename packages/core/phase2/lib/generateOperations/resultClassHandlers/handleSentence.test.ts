import type { Offence, Result } from "../../../../types/AnnotatedHearingOutcome"
import { PncOperation } from "../../../../types/PncOperation"
import generateResultClassHandlerParams from "../../../tests/helpers/generateResultClassHandlerParams"
import areAnyPncResults2007 from "../areAnyPncResults2007"
import { handleSentence } from "./handleSentence"

jest.mock("../areAnyPncResults2007")
const mockedAreAnyPncResults2007 = areAnyPncResults2007 as jest.Mock

describe("handleSentence", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("should return PENHRG operation when fixedPenalty is true and ccrId has value", () => {
    const params = generateResultClassHandlerParams({ fixedPenalty: true })

    const operations = handleSentence(params)

    expect(operations).toStrictEqual([
      { code: PncOperation.PENALTY_HEARING, data: { courtCaseReference: "234" }, status: "NotAttempted" }
    ])
  })

  it("should return PENHRG operation when fixedPenalty is true and ccrId does not have value", () => {
    const params = generateResultClassHandlerParams({
      fixedPenalty: true,
      offence: {
        CourtCaseReferenceNumber: undefined
      } as Offence
    })

    const operations = handleSentence(params)

    expect(operations).toStrictEqual([{ code: PncOperation.PENALTY_HEARING, data: undefined, status: "NotAttempted" }])
  })

  it("should return SENDEF operation when adjudication exists, there are no 2007 result code, and ccrId has value", () => {
    const params = generateResultClassHandlerParams({
      fixedPenalty: false,
      result: { PNCAdjudicationExists: true } as Result
    })
    mockedAreAnyPncResults2007.mockReturnValue(false)

    const operations = handleSentence(params)

    expect(operations).toStrictEqual([
      { code: PncOperation.SENTENCE_DEFERRED, data: { courtCaseReference: "234" }, status: "NotAttempted" }
    ])
  })

  it("should return SENDEF operation when adjudication exists, there are no 2007 result code, and ccrId does not have value", () => {
    const params = generateResultClassHandlerParams({
      fixedPenalty: false,
      result: { PNCAdjudicationExists: true } as Result,
      offence: {
        CourtCaseReferenceNumber: undefined
      } as Offence
    })
    mockedAreAnyPncResults2007.mockReturnValue(false)

    const operations = handleSentence(params)

    expect(operations).toStrictEqual([
      { code: PncOperation.SENTENCE_DEFERRED, data: undefined, status: "NotAttempted" }
    ])
  })

  it("should return SUBVAR operation when adjudication exists, and there is a 2007 result code", () => {
    const params = generateResultClassHandlerParams({
      fixedPenalty: false,
      resubmitted: true,
      result: { PNCAdjudicationExists: true } as Result,
      offence: {} as Offence,
      offenceIndex: 1,
      resultIndex: 1
    })
    mockedAreAnyPncResults2007.mockReturnValue(true)

    const operations = handleSentence(params)

    expect(operations).toStrictEqual([
      { code: PncOperation.DISPOSAL_UPDATED, data: { courtCaseReference: "234" }, status: "NotAttempted" }
    ])
  })

  it("should return SUBVAR operation without operation data when adjudication exists, there is a 2007 result code, and ccrId is not set", () => {
    const params = generateResultClassHandlerParams({
      fixedPenalty: false,
      resubmitted: true,
      result: { PNCAdjudicationExists: true } as Result,
      offence: {
        CourtCaseReferenceNumber: undefined
      } as Offence,
      offenceIndex: 1,
      resultIndex: 1
    })
    mockedAreAnyPncResults2007.mockReturnValue(true)

    const operations = handleSentence(params)

    expect(operations).toStrictEqual([
      {
        code: PncOperation.DISPOSAL_UPDATED,
        data: undefined,
        status: "NotAttempted"
      }
    ])
  })

  it("should return no operations when PNC adjudication does not exist", () => {
    const params = generateResultClassHandlerParams({
      fixedPenalty: false,
      result: { PNCAdjudicationExists: false } as Result,
      offence: {} as Offence,
      offenceIndex: 1,
      resultIndex: 1
    })

    const operations = handleSentence(params)

    expect(operations).toHaveLength(0)
  })
})
