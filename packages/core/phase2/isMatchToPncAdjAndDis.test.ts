import type { PncCourtCaseSummary } from "../comparison/types/MatchingComparisonOutput"
import type { Offence, Result } from "../types/AnnotatedHearingOutcome"
import type { NonEmptyArray } from "../types/NonEmptyArray"
import type { PncDisposal, PncQueryResult } from "../types/PncQueryResult"
import isMatchToPncAdjAndDis, { allRecordableResultsMatchAPncDisposal } from "./isMatchToPncAdjAndDis"
import generateAhoFromOffenceList from "./tests/fixtures/helpers/generateAhoFromOffenceList"

describe("check isMatchToPncAdjAndDis", () => {
  const aho = generateAhoFromOffenceList([])
  const results: NonEmptyArray<Result> = [{} as Result]

  it("If there is no courtcase ref nr given as input or none exists on the aho, then returns false", () => {
    const result = isMatchToPncAdjAndDis(results, aho, undefined, 0, undefined)
    expect(result).toBe(false)
  })

  it("If there is are no PNC query courtcases that match the input courtCaseReference, then returns false", () => {
    const courtCaseNoOffences: PncCourtCaseSummary = {
      courtCaseReference: "FOO",
      offences: []
    }

    const pncQuery: PncQueryResult = {
      forceStationCode: "06",
      checkName: "",
      pncId: "",
      courtCases: [courtCaseNoOffences]
    }

    aho.PncQuery = pncQuery

    const result = isMatchToPncAdjAndDis(results, aho, "DOES_NOT_MATCH_FOO", 0, undefined)
    expect(result).toBe(false)
  })

  it("If there are no offences in the matching courtCase of the PNC Query, then returns false", () => {
    const courtCaseNoOffences: PncCourtCaseSummary = {
      courtCaseReference: "FOO",
      offences: []
    }

    const pncQuery: PncQueryResult = {
      forceStationCode: "06",
      checkName: "",
      pncId: "",
      courtCases: [courtCaseNoOffences]
    }

    aho.PncQuery = pncQuery

    const result = isMatchToPncAdjAndDis(results, aho, "FOO", 0, undefined)
    expect(result).toBe(false)
  })

  it.todo("Test the positive cases too")
})

describe("check allRecordableResultsMatchAPncDisposal", () => {
  it("Given an unrecordable result, returns true", () => {
    const matchingResult = {
      PNCDisposalType: 2063
    }
    const nonMatchingResult = {
      PNCDisposalType: 2063
    }
    const unrecordableResult = {
      PNCDisposalType: 1000
    }
    const results = [matchingResult, nonMatchingResult, unrecordableResult] as Result[]
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

    const result1 = allRecordableResultsMatchAPncDisposal(results, disposals, aho, 0)
    expect(result1).toBe(true)
  })

  it("Given non-matching results, returns false", () => {
    const nonMatchingResult = {
      PNCDisposalType: 2064
    }

    const results = [nonMatchingResult, nonMatchingResult] as Result[]
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
    expect(result).toBe(false)
  })

  it("Given matching results, returns true", () => {
    const matchingResult = {
      PNCDisposalType: 2063
    }

    const results = [matchingResult, matchingResult] as Result[]
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
    expect(result).toBe(true)
  })
})
