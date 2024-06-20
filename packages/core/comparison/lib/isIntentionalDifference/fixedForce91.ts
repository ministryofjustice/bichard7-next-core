import type { IntentionalDifference } from "../../types/IntentionalDifference"

// We added force 91 to Bichard and core, but there was an overlap where we were handling
// incoming messages for force 91 when it was not configured

const fixedForce91 = ({ expected, actual }: IntentionalDifference): boolean => {
  if (JSON.stringify(expected.courtResultMatchingSummary) !== JSON.stringify(actual.courtResultMatchingSummary)) {
    return false
  }

  const expectedOuCode = expected.aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.OrganisationUnitCode
  const actualOuCode = actual.aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.OrganisationUnitCode

  return !!expectedOuCode && !!actualOuCode && expectedOuCode !== actualOuCode && actualOuCode.startsWith("91")
}

export default fixedForce91
