import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import type { ComparisonData } from "../../types/ComparisonData"
import { checkIntentionalDifferenceForPhases } from "./index"

// Core will remove double spaces in the names

const ahoHasDoubleSpaces = (aho: AnnotatedHearingOutcome): boolean | undefined =>
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.PersonName.GivenName?.some((name) =>
    name.match(/\s+\s+/)
  ) ||
  !!aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.PersonName.FamilyName.match(
    /\s+\s+/
  )

const doubleSpacesInNames = ({ expected, actual, phase }: ComparisonData) =>
  checkIntentionalDifferenceForPhases([1, 2], phase, (): boolean => {
    const expectedAhoHasDoubleSpaces = ahoHasDoubleSpaces(expected.aho)
    const actualAhoHasDoubleSpaces = ahoHasDoubleSpaces(actual.aho)

    return !!expectedAhoHasDoubleSpaces && !actualAhoHasDoubleSpaces
  })

export default doubleSpacesInNames
