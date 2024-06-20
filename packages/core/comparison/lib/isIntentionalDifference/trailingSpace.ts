import serialiseToXml from "../../../phase1/serialise/ahoXml/serialiseToXml"
import type { IntentionalDifference } from "../../types/IntentionalDifference"

// Core will remove a trailing space in the bail conditions

const trailingSpace = ({ expected, actual }: IntentionalDifference): boolean => {
  if (JSON.stringify(expected.courtResultMatchingSummary) !== JSON.stringify(actual.courtResultMatchingSummary)) {
    return false
  }

  const expectedXml = serialiseToXml(expected.aho)
  const actualXml = serialiseToXml(actual.aho)

  const expectedBailConditions =
    expected.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.BailConditions

  const bailConditionsHaveTrailingSpace = expectedBailConditions.some((bc) => /\s+$/.test(bc))

  return expectedXml === actualXml && bailConditionsHaveTrailingSpace
}

export default trailingSpace
