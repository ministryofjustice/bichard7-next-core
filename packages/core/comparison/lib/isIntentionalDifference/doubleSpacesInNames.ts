import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import type { CourtResultMatchingSummary } from "../../types/MatchingComparisonOutput"

// Core will remove double spaces in the names

const ahoHasDoubleSpaces = (aho: AnnotatedHearingOutcome): boolean | undefined =>
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.PersonName.GivenName?.some((name) =>
    name.match(/\s+\s+/)
  ) ||
  !!aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.PersonName.FamilyName.match(
    /\s+\s+/
  )

const doubleSpacesInNames = (
  _: CourtResultMatchingSummary | null,
  __: CourtResultMatchingSummary | null,
  expectedAho: AnnotatedHearingOutcome,
  actualAho: AnnotatedHearingOutcome,
  ___: AnnotatedHearingOutcome
): boolean => {
  const expectedAhoHasDoubleSpaces = ahoHasDoubleSpaces(expectedAho)
  const actualAhoHasDoubleSpaces = ahoHasDoubleSpaces(actualAho)

  return !!expectedAhoHasDoubleSpaces && !actualAhoHasDoubleSpaces
}

export default doubleSpacesInNames
