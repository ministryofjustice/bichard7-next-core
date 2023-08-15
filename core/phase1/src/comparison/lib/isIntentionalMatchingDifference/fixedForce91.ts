import type { AnnotatedHearingOutcome } from "core/phase1/src/types/AnnotatedHearingOutcome"
import type { CourtResultMatchingSummary } from "../../types/MatchingComparisonOutput"

// We added force 91 to Bichard and core, but there was an overlap where we were handling
// incoming messages for force 91 when it was not configured

const fixedForce91 = (
  expected: CourtResultMatchingSummary | null,
  actual: CourtResultMatchingSummary | null,
  expectedAho: AnnotatedHearingOutcome,
  actualAho: AnnotatedHearingOutcome,
  ___: AnnotatedHearingOutcome
): boolean => {
  if (JSON.stringify(expected) !== JSON.stringify(actual)) {
    return false
  }

  const expectedOuCode = expectedAho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.OrganisationUnitCode
  const actualOuCode = actualAho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.OrganisationUnitCode

  return !!expectedOuCode && !!actualOuCode && expectedOuCode !== actualOuCode && actualOuCode.startsWith("91")
}

export default fixedForce91
