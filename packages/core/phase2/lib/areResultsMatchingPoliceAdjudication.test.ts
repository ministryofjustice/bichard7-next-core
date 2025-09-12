import type { Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PoliceOffence } from "@moj-bichard7/common/types/PoliceQueryResult"

import areResultsMatchingPoliceAdjudication from "./areResultsMatchingPoliceAdjudication"

describe("areResultsMatchingPoliceAdjudication", () => {
  const matchingResult = { PNCDisposalType: 2063, Verdict: "G", PleaStatus: "G" } as Result
  const matchingResults = [matchingResult]
  const matchingHearingDate = new Date(2024, 3, 1)
  const matchingOffenceReasonSequence = "001"
  const matchingPoliceOffence = {
    offence: { sequenceNumber: 1 },
    adjudication: {
      verdict: "GUILTY",
      plea: "GUILTY",
      sentenceDate: matchingHearingDate,
      offenceTICNumber: 0,
      weedFlag: undefined
    }
  } as PoliceOffence

  it("returns false when an adjudication cannot be created from results", () => {
    const results = [] as Result[]

    const result = areResultsMatchingPoliceAdjudication(
      results,
      matchingHearingDate,
      matchingOffenceReasonSequence,
      matchingPoliceOffence
    )

    expect(result).toBe(false)
  })

  it("returns false when the police offence doesn't have an adjudication", () => {
    const policeOffence = { ...matchingPoliceOffence, adjudication: undefined }

    const result = areResultsMatchingPoliceAdjudication(
      matchingResults,
      matchingHearingDate,
      matchingOffenceReasonSequence,
      policeOffence
    )

    expect(result).toBe(false)
  })

  it("returns false when offence reason sequence doesn't match", () => {
    const offenceReasonSequence = "999"

    const result = areResultsMatchingPoliceAdjudication(
      matchingResults,
      matchingHearingDate,
      offenceReasonSequence,
      matchingPoliceOffence
    )

    expect(result).toBe(false)
  })

  it("returns false when verdict doesn't match", () => {
    const results = [{ ...matchingResult, Verdict: "NG" }]

    const result = areResultsMatchingPoliceAdjudication(
      results,
      matchingHearingDate,
      matchingOffenceReasonSequence,
      matchingPoliceOffence
    )

    expect(result).toBe(false)
  })

  it("returns false when plea doesn't match", () => {
    const results = [{ ...matchingResult, PleaStatus: "DEN" }]

    const result = areResultsMatchingPoliceAdjudication(
      results,
      matchingHearingDate,
      matchingOffenceReasonSequence,
      matchingPoliceOffence
    )

    expect(result).toBe(false)
  })

  it("returns false when offence TIC number doesn't match", () => {
    const results = [{ ...matchingResult, NumberOfOffencesTIC: 999 }]

    const result = areResultsMatchingPoliceAdjudication(
      results,
      matchingHearingDate,
      matchingOffenceReasonSequence,
      matchingPoliceOffence
    )

    expect(result).toBe(false)
  })

  it("returns false when hearing date doesn't match", () => {
    const hearingDate = new Date(1999, 9, 9)

    const result = areResultsMatchingPoliceAdjudication(
      matchingResults,
      hearingDate,
      matchingOffenceReasonSequence,
      matchingPoliceOffence
    )

    expect(result).toBe(false)
  })
})
