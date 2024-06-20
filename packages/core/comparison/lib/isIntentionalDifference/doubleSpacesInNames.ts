import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import type { IntentionalDifference } from "../../types/IntentionalDifference"

// Core will remove double spaces in the names

const ahoHasDoubleSpaces = (aho: AnnotatedHearingOutcome): boolean | undefined =>
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.PersonName.GivenName?.some((name) =>
    name.match(/\s+\s+/)
  ) ||
  !!aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.PersonName.FamilyName.match(
    /\s+\s+/
  )

const doubleSpacesInNames = ({ expected, actual }: IntentionalDifference): boolean => {
  const expectedAhoHasDoubleSpaces = ahoHasDoubleSpaces(expected.aho)
  const actualAhoHasDoubleSpaces = ahoHasDoubleSpaces(actual.aho)

  return !!expectedAhoHasDoubleSpaces && !actualAhoHasDoubleSpaces
}

export default doubleSpacesInNames
