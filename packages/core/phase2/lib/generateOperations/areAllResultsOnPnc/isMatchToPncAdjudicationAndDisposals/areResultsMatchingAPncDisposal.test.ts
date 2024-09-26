import type { Offence, Result } from "../../../../../types/AnnotatedHearingOutcome"
import type { PncDisposal } from "../../../../../types/PncQueryResult"
import areResultsMatchAPncDisposal from "./areResultsMatchingAPncDisposal"

describe("areResultsMatchingAPncDisposal", () => {
  it("Given an unrecordable result, returns true", () => {
    const matchingResult = {
      PNCDisposalType: 2063,
      ResultQualifierVariable: []
    }
    const nonMatchingResult = {
      PNCDisposalType: 2063,
      ResultQualifierVariable: []
    }
    const unrecordableResult = {
      PNCDisposalType: 1000,
      ResultQualifierVariable: []
    }
    const offence = { Result: [matchingResult, nonMatchingResult, unrecordableResult] } as unknown as Offence

    const disposals = [
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

    const result = areResultsMatchAPncDisposal(offence, disposals)
    expect(result).toBe(true)
  })

  it("Given non-matching results, returns false", () => {
    const nonMatchingResult = {
      PNCDisposalType: 2064,
      ResultQualifierVariable: []
    } as unknown as Result

    const offence = { Result: [nonMatchingResult, nonMatchingResult] } as unknown as Offence
    const disposals = [
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

    const result = areResultsMatchAPncDisposal(offence, disposals)
    expect(result).toBe(false)
  })

  it("Given matching results, returns true", () => {
    const matchingResult = {
      PNCDisposalType: 2063,
      ResultQualifierVariable: []
    } as unknown as Result

    const offence = { Result: [matchingResult, matchingResult] } as unknown as Offence
    const disposals = [
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

    const result = areResultsMatchAPncDisposal(offence, disposals)

    expect(result).toBe(true)
  })

  it("should return exceptions", () => {
    const matchingResult = {
      PNCDisposalType: 2063,
      CJSresultCode: 3106,
      ResultQualifierVariable: [],
      ResultVariableText: `NOT ENTER ${"A".repeat(100)} THIS EXCLUSION REQUIREMENT LASTS FOR TIME`
    } as unknown as Result

    const offence = { Result: [matchingResult, matchingResult] } as unknown as Offence
    const disposals = [
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

    const result = areResultsMatchAPncDisposal(offence, disposals)

    expect(result).toBe(false)
  })
})
