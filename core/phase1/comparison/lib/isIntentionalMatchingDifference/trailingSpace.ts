import convertAhoToXml from "core/phase1/serialise/ahoXml/generate"
import type { AnnotatedHearingOutcome } from "core/phase1/types/AnnotatedHearingOutcome"
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

  const expectedXml = convertAhoToXml(expectedAho)
  const actualXml = convertAhoToXml(actualAho)

  const expectedBailConditions = expectedAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.BailConditions

  const bailConditionsHaveTrailingSpace = expectedBailConditions.some((bc) => /\s+$/.test(bc))

  return expectedXml === actualXml && bailConditionsHaveTrailingSpace
}

export default trailingSpace
