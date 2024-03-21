import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import serialiseToXml from "../../../phase1/serialise/ahoXml/serialiseToXml"
import type { CourtResultMatchingSummary } from "../../types/MatchingComparisonOutput"

// Core will remove a trailing space in the bail conditions

const trailingSpace = (
  expected: CourtResultMatchingSummary | null,
  actual: CourtResultMatchingSummary | null,
  expectedAho: AnnotatedHearingOutcome,
  actualAho: AnnotatedHearingOutcome,
  ___: AnnotatedHearingOutcome
): boolean => {
  if (JSON.stringify(expected) !== JSON.stringify(actual)) {
    return false
  }

  const expectedXml = serialiseToXml(expectedAho)
  const actualXml = serialiseToXml(actualAho)

  const expectedBailConditions = expectedAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.BailConditions

  const bailConditionsHaveTrailingSpace = expectedBailConditions.some((bc) => /\s+$/.test(bc))

  return expectedXml === actualXml && bailConditionsHaveTrailingSpace
}

export default trailingSpace
