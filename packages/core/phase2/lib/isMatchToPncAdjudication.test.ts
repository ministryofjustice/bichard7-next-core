import type { PncOffence } from "../../types/PncQueryResult"
import isMatchToPncAdjudication from "./isMatchToPncAdjudication"
import type { Result } from "../../types/AnnotatedHearingOutcome"

describe("isMatchToPncAdjudication", () => {
  const matchingResult = { PNCDisposalType: 2063, Verdict: "G", PleaStatus: "G" } as Result
  const matchingResults = [matchingResult]
  const matchingHearingDate = new Date(2024, 3, 1)
  const matchingOffenceReasonSequence = "001"
  const matchingPncOffence = {
    offence: { sequenceNumber: 1 },
    adjudication: {
      verdict: "GUILTY",
      plea: "GUILTY",
      sentenceDate: matchingHearingDate,
      offenceTICNumber: 0,
      weedFlag: undefined
    }
  } as PncOffence

  it("returns false when a PNC adjudication cannot be created from results", () => {
    const results = [] as Result[]

    const result = isMatchToPncAdjudication(
      results,
      matchingHearingDate,
      matchingPncOffence,
      matchingOffenceReasonSequence
    )

    expect(result).toBe(false)
  })

  it("returns false when the PNC offence doesn't have an adjudication", () => {
    const pncOffence = { ...matchingPncOffence, adjudication: undefined }

    const result = isMatchToPncAdjudication(
      matchingResults,
      matchingHearingDate,
      pncOffence,
      matchingOffenceReasonSequence
    )

    expect(result).toBe(false)
  })

  it("returns false when offence reason sequence doesn't match", () => {
    const offenceReasonSequence = "999"

    const result = isMatchToPncAdjudication(
      matchingResults,
      matchingHearingDate,
      matchingPncOffence,
      offenceReasonSequence
    )

    expect(result).toBe(false)
  })

  it("returns false when verdict doesn't match", () => {
    const results = [{ ...matchingResult, Verdict: "NG" }]

    const result = isMatchToPncAdjudication(
      results,
      matchingHearingDate,
      matchingPncOffence,
      matchingOffenceReasonSequence
    )

    expect(result).toBe(false)
  })

  it("returns false when plea doesn't match", () => {
    const results = [{ ...matchingResult, PleaStatus: "DEN" }]

    const result = isMatchToPncAdjudication(
      results,
      matchingHearingDate,
      matchingPncOffence,
      matchingOffenceReasonSequence
    )

    expect(result).toBe(false)
  })

  it("returns false when offence TIC number doesn't match", () => {
    const results = [{ ...matchingResult, NumberOfOffencesTIC: 999 }]

    const result = isMatchToPncAdjudication(
      results,
      matchingHearingDate,
      matchingPncOffence,
      matchingOffenceReasonSequence
    )

    expect(result).toBe(false)
  })

  it("returns false when hearing date doesn't match", () => {
    const hearingDate = new Date(1999, 9, 9)

    const result = isMatchToPncAdjudication(
      matchingResults,
      hearingDate,
      matchingPncOffence,
      matchingOffenceReasonSequence
    )

    expect(result).toBe(false)
  })
})
