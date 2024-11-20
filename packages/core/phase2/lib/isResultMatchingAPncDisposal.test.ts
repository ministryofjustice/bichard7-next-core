import type { Result } from "../../types/AnnotatedHearingOutcome"
import type { PncDisposal } from "../../types/PncQueryResult"

import isResultMatchingAPncDisposal from "./isResultMatchingAPncDisposal"

describe("isResultMatchingAPncDisposal", () => {
  const pncDisposal: PncDisposal = {
    qtyDuration: "A4",
    qtyDate: "21052024",
    qtyMonetaryValue: "25000",
    qualifiers: "Q",
    type: 9999,
    text: "EXCLUDED FROM LOCATION"
  }
  const ahoResult: Result = {
    PNCDisposalType: 9999,
    CJSresultCode: 3041,
    ResultQualifierVariable: [{ Code: "Q" }],
    ResultVariableText: "DEFENDANT EXCLUDED FROM LOCATION FOR A PERIOD OF TIME",
    AmountSpecifiedInResult: [
      {
        Amount: 25000,
        DecimalPlaces: 2
      }
    ],
    DateSpecifiedInResult: [
      {
        Date: new Date("05/21/2024"),
        Sequence: 1
      }
    ],
    Duration: [
      {
        DurationLength: 4,
        DurationType: "",
        DurationUnit: "A"
      }
    ]
  } as Result

  it("returns true when an AHO result matches a PNC disposal on all its matching fields", () => {
    const result = isResultMatchingAPncDisposal(ahoResult, [pncDisposal])

    expect(result).toBe(true)
  })

  it("returns false when disposals list is empty", () => {
    const ahoResult = { ResultQualifierVariable: [] } as unknown as Result

    const result = isResultMatchingAPncDisposal(ahoResult, [])

    expect(result).toBe(false)
  })

  it("returns false when an AHO result has a different type to the PNC disposal", () => {
    const nonMatchingAhoResult = { ...ahoResult, PNCDisposalType: 1234 }

    const result = isResultMatchingAPncDisposal(nonMatchingAhoResult, [pncDisposal])

    expect(result).toBe(false)
  })

  it("returns false when an AHO result has different qualifiers to the PNC disposal", () => {
    const nonMatchingAhoResult = { ...ahoResult, ResultQualifierVariable: [{ Code: "XXX" }] }

    const result = isResultMatchingAPncDisposal(nonMatchingAhoResult, [pncDisposal])

    expect(result).toBe(false)
  })

  it("returns false when an AHO result has different dates to the PNC disposal", () => {
    const nonMatchingAhoResult = {
      ...ahoResult,
      DateSpecifiedInResult: [
        {
          Date: new Date("03/01/1997"),
          Sequence: 1
        }
      ]
    }

    const result = isResultMatchingAPncDisposal(nonMatchingAhoResult, [pncDisposal])

    expect(result).toBe(false)
  })

  it("returns false when an AHO result has different monetary values to the PNC disposal", () => {
    const nonMatchingAhoResult = {
      ...ahoResult,
      AmountSpecifiedInResult: [
        {
          Amount: 11111,
          DecimalPlaces: 2
        }
      ]
    }

    const result = isResultMatchingAPncDisposal(nonMatchingAhoResult, [pncDisposal])

    expect(result).toBe(false)
  })

  it("returns false when an AHO result has different durations to the PNC disposal", () => {
    const nonMatchingAhoResult = {
      ...ahoResult,
      Duration: [
        {
          DurationLength: 1234,
          DurationType: "",
          DurationUnit: "B"
        }
      ]
    }

    const result = isResultMatchingAPncDisposal(nonMatchingAhoResult, [pncDisposal])

    expect(result).toBe(false)
  })

  it("returns false when an AHO result doesn't have any durations", () => {
    const nonMatchingAhoResult = {
      ...ahoResult,
      Duration: []
    }

    const result = isResultMatchingAPncDisposal(nonMatchingAhoResult, [pncDisposal])

    expect(result).toBe(false)
  })

  it("returns false when an AHO result has different text to the PNC disposal", () => {
    const nonMatchingAhoResult = {
      ...ahoResult,
      ResultVariableText: "SOMETHING DIFFERENT"
    }

    const result = isResultMatchingAPncDisposal(nonMatchingAhoResult, [pncDisposal])

    expect(result).toBe(false)
  })

  it("returns false when an AHO result doesn't have any text", () => {
    const nonMatchingAhoResult = {
      ...ahoResult,
      ResultVariableText: undefined
    }

    const result = isResultMatchingAPncDisposal(nonMatchingAhoResult, [pncDisposal])

    expect(result).toBe(false)
  })

  it("returns true when an AHO result has same text with case difference to the PNC disposal", () => {
    const matchingAhoResult = {
      ...ahoResult,
      ResultVariableText: ahoResult.ResultVariableText?.toUpperCase()
    }

    const result = isResultMatchingAPncDisposal(matchingAhoResult, [pncDisposal])

    expect(result).toBe(true)
  })
})
