import type { Result } from "../../types/AnnotatedHearingOutcome"

import generateAhoMatchingPncAdjudicationAndDisposals from "../tests/helpers/generateAhoMatchingPncAdjudicationAndDisposals"
import areResultsMatchingPncAdjudicationAndDisposals from "./areResultsMatchingPncAdjudicationAndDisposals"

describe("areResultsMatchingPncAdjudicationAndDisposals", () => {
  it("returns true when no results", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({ hasResults: false })
    const offence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]

    const result = areResultsMatchingPncAdjudicationAndDisposals(aho, offence)

    expect(result).toBe(true)
  })

  it("returns true when no offence reason sequence and no recordable results", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({ hasOffenceReasonSequence: false })
    const offence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]
    offence.Result = [{ PNCDisposalType: 1000 }] as Result[]

    const result = areResultsMatchingPncAdjudicationAndDisposals(aho, offence)

    expect(result).toBe(true)
  })

  it("returns false when no offence reason sequence and recordable results", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({ hasOffenceReasonSequence: false })
    const offence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]

    const result = areResultsMatchingPncAdjudicationAndDisposals(aho, offence)

    expect(result).toBe(false)
  })

  it("returns false when no PNC ID", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({ hasPncId: false })
    const offence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]

    const result = areResultsMatchingPncAdjudicationAndDisposals(aho, offence)

    expect(result).toBe(false)
  })

  it("returns false when no PNC court cases", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({ hasPncOffences: false })
    const offence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]

    const result = areResultsMatchingPncAdjudicationAndDisposals(aho, offence)

    expect(result).toBe(false)
  })

  it("returns true when results match PNC adjudication and disposals", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
    const offence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]

    const result = areResultsMatchingPncAdjudicationAndDisposals(aho, offence)

    expect(result).toBe(true)
  })

  it("returns false when results match PNC adjudication but not disposals", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({ firstPncDisposalType: 9999 })
    const offence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]

    const result = areResultsMatchingPncAdjudicationAndDisposals(aho, offence)

    expect(result).toBe(false)
  })

  it("returns false when results match PNC disposals but not adjudication", () => {
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
    const offence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]
    offence.Result[0].Verdict = "NG"

    const result = areResultsMatchingPncAdjudicationAndDisposals(aho, offence)

    expect(result).toBe(false)
  })

  it("checks for exceptions when an offence index and function is provided", () => {
    const checkExceptionFn = jest.fn()
    const aho = generateAhoMatchingPncAdjudicationAndDisposals({})
    const offence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]

    areResultsMatchingPncAdjudicationAndDisposals(aho, offence, 0, checkExceptionFn)

    expect(checkExceptionFn).toHaveBeenCalled()
  })
})
