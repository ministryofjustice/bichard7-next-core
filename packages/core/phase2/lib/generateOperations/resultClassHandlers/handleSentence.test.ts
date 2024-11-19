import type { Offence, Result } from "../../../../types/AnnotatedHearingOutcome"

import { PncOperation } from "../../../../types/PncOperation"
import generateResultClassHandlerParams from "../../../tests/helpers/generateResultClassHandlerParams"
import areAnyPncDisposalsWithType from "../../areAnyPncDisposalsWithType"
import { handleSentence } from "./handleSentence"

jest.mock("../../areAnyPncDisposalsWithType")
const mockedAreAnyPncResults2007 = areAnyPncDisposalsWithType as jest.Mock

describe("handleSentence", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("returns penalty hearing operation with data when penalty notice case reference number and court case reference exists", () => {
    const params = generateResultClassHandlerParams({ fixedPenalty: true })

    const operations = handleSentence(params)

    expect(operations).toStrictEqual([
      { code: PncOperation.PENALTY_HEARING, data: { courtCaseReference: "234" }, status: "NotAttempted" }
    ])
  })

  it("returns penalty hearing operation without data when penalty notice case reference number exists and court case reference doesn't exist", () => {
    const params = generateResultClassHandlerParams({
      fixedPenalty: true,
      offence: {
        CourtCaseReferenceNumber: undefined
      } as Offence
    })

    const operations = handleSentence(params)

    expect(operations).toStrictEqual([{ code: PncOperation.PENALTY_HEARING, data: undefined, status: "NotAttempted" }])
  })

  it("returns sentence deferred operation with data when PNC adjudication exists, court case reference exists and offence has no 2007 result code", () => {
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

  it("returns sentence deferred operation without data when PNC adjudication exists, offence has no 2007 result code and court case reference doesn't exist", () => {
    const params = generateResultClassHandlerParams({
      fixedPenalty: false,
      offence: {
        CourtCaseReferenceNumber: undefined
      } as Offence,
      result: { PNCAdjudicationExists: true } as Result
    })
    mockedAreAnyPncResults2007.mockReturnValue(false)

    const operations = handleSentence(params)

    expect(operations).toStrictEqual([
      { code: PncOperation.SENTENCE_DEFERRED, data: undefined, status: "NotAttempted" }
    ])
  })

  it("returns disposal updated operation with data when PNC adjudication exists, court case reference exists and offence has a 2007 result code", () => {
    const params = generateResultClassHandlerParams({
      fixedPenalty: false,
      offence: {} as Offence,
      offenceIndex: 1,
      resubmitted: true,
      result: { PNCAdjudicationExists: true } as Result,
      resultIndex: 1
    })
    mockedAreAnyPncResults2007.mockReturnValue(true)

    const operations = handleSentence(params)

    expect(operations).toStrictEqual([
      { code: PncOperation.DISPOSAL_UPDATED, data: { courtCaseReference: "234" }, status: "NotAttempted" }
    ])
  })

  it("returns disposal updated operation without data when PNC adjudication exists, offence has a 2007 result code and court case reference doesn't exist", () => {
    const params = generateResultClassHandlerParams({
      fixedPenalty: false,
      offence: {
        CourtCaseReferenceNumber: undefined
      } as Offence,
      offenceIndex: 1,
      resubmitted: true,
      result: { PNCAdjudicationExists: true } as Result,
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

  it("returns no operations when PNC adjudication does not exist", () => {
    const params = generateResultClassHandlerParams({
      fixedPenalty: false,
      offence: {} as Offence,
      offenceIndex: 1,
      result: { PNCAdjudicationExists: false } as Result,
      resultIndex: 1
    })

    const operations = handleSentence(params)

    expect(operations).toHaveLength(0)
  })
})
