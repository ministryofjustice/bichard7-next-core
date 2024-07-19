import { Offence, Result } from "../../../../../types/AnnotatedHearingOutcome"
import type { PncDisposal } from "../../../../../types/PncQueryResult"
import generateAhoFromOffenceList from "../../../../tests/fixtures/helpers/generateAhoFromOffenceList"
import allRecordableResultsMatchAPncDisposal from "./allRecordableResultsMatchAPncDisposal"

describe("allRecordableResultsMatchAPncDisposal", () => {
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
    const results = [matchingResult, nonMatchingResult, unrecordableResult] as unknown as Result[]
    const aho = generateAhoFromOffenceList([{ Result: results } as Offence])

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

    const result = allRecordableResultsMatchAPncDisposal(results, disposals, aho, 0)
    expect(result.value).toBe(true)
    expect(result.exceptions).toStrictEqual([])
  })

  it("Given non-matching results, returns false", () => {
    const nonMatchingResult = {
      PNCDisposalType: 2064,
      ResultQualifierVariable: []
    } as unknown as Result

    const results = [nonMatchingResult, nonMatchingResult]
    const aho1 = generateAhoFromOffenceList([{ Result: results } as Offence])

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

    const result = allRecordableResultsMatchAPncDisposal(results, disposals, aho1, 0)
    expect(result.value).toBe(false)
    expect(result.exceptions).toStrictEqual([])
  })

  it("Given matching results, returns true", () => {
    const matchingResult = {
      PNCDisposalType: 2063,
      ResultQualifierVariable: []
    } as unknown as Result

    const results = [matchingResult, matchingResult]
    const aho1 = generateAhoFromOffenceList([{ Result: results } as Offence])

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

    const result = allRecordableResultsMatchAPncDisposal(results, disposals, aho1, 0)
    expect(result.value).toBe(true)
    expect(result.exceptions).toStrictEqual([])
  })

  it("should return exceptions", () => {
    const matchingResult = {
      PNCDisposalType: 2063,
      CJSresultCode: 3106,
      ResultQualifierVariable: [],
      ResultVariableText: `NOT ENTER ${"A".repeat(100)} THIS EXCLUSION REQUIREMENT LASTS FOR TIME`
    } as unknown as Result

    const results = [matchingResult, matchingResult]
    const aho1 = generateAhoFromOffenceList([{ Result: results } as Offence])

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

    const result = allRecordableResultsMatchAPncDisposal(results, disposals, aho1, 0)
    expect(result.value).toBe(false)
    expect(result.exceptions).toStrictEqual([
      {
        code: "HO200200",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "Result",
          0,
          "ResultVariableText"
        ]
      }
    ])
  })
})
