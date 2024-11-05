import type { Offence } from "../../types/AnnotatedHearingOutcome"
import type { PncDisposal } from "../../types/PncQueryResult"
import areResultsMatchAPncDisposal from "./areResultsMatchingAPncDisposal"

describe("areResultsMatchingAPncDisposal", () => {
  const matchingResult = { PNCDisposalType: 2063, ResultQualifierVariable: [] }
  const nonMatchingResult = { PNCDisposalType: 2064, ResultQualifierVariable: [] }
  const unrecordableResult = { PNCDisposalType: 1000, ResultQualifierVariable: [] }
  const pncDisposals = [
    {
      qtyDate: "",
      qtyDuration: "",
      type: 2063,
      qtyUnitsFined: "",
      qtyMonetaryValue: "",
      qualifiers: "",
      text: ""
    }
  ] as PncDisposal[]

  it("returns true when only an unrecordable result", () => {
    const offence = { Result: [unrecordableResult] } as unknown as Offence

    const result = areResultsMatchAPncDisposal(offence, pncDisposals)

    expect(result).toBe(true)
  })

  it("returns true when all results match a PNC disposal", () => {
    const offence = { Result: [matchingResult, matchingResult] } as unknown as Offence

    const result = areResultsMatchAPncDisposal(offence, pncDisposals)

    expect(result).toBe(true)
  })

  it("returns true when an unrecordable result with a result that matches a PNC disposal", () => {
    const offence = { Result: [matchingResult, unrecordableResult] } as unknown as Offence

    const result = areResultsMatchAPncDisposal(offence, pncDisposals)

    expect(result).toBe(true)
  })

  it("returns false when an unrecordable result with a result that doesn't match a PNC disposal", () => {
    const offence = { Result: [nonMatchingResult, unrecordableResult] } as unknown as Offence

    const result = areResultsMatchAPncDisposal(offence, pncDisposals)

    expect(result).toBe(false)
  })

  it("returns false when all results don't match a PNC disposal", () => {
    const offence = { Result: [nonMatchingResult, nonMatchingResult] } as unknown as Offence

    const result = areResultsMatchAPncDisposal(offence, pncDisposals)

    expect(result).toBe(false)
  })

  it("returns false when a result that matches and doesn't match a PNC disposal", () => {
    const offence = { Result: [nonMatchingResult, matchingResult] } as unknown as Offence

    const result = areResultsMatchAPncDisposal(offence, pncDisposals)

    expect(result).toBe(false)
  })

  it("returns false when a unrecordable result, matching result and non-matching result", () => {
    const offence = { Result: [nonMatchingResult, unrecordableResult, matchingResult] } as unknown as Offence

    const result = areResultsMatchAPncDisposal(offence, pncDisposals)

    expect(result).toBe(false)
  })

  it("checks for exceptions when an offence index and function is provided", () => {
    const offenceIndex = 0
    const resultIndex = 0
    const checkExceptionFn = jest.fn()
    const offence = { Result: [matchingResult] } as unknown as Offence

    areResultsMatchAPncDisposal(offence, pncDisposals, offenceIndex, checkExceptionFn)

    expect(checkExceptionFn).toHaveBeenNthCalledWith(1, matchingResult, offenceIndex, resultIndex)
  })

  it("doesn't check for exceptions when an offence index isn't provided", () => {
    const checkExceptionFn = jest.fn()
    const offence = { Result: [matchingResult] } as unknown as Offence

    areResultsMatchAPncDisposal(offence, pncDisposals, undefined, checkExceptionFn)

    expect(checkExceptionFn).not.toHaveBeenCalled()
  })
})
