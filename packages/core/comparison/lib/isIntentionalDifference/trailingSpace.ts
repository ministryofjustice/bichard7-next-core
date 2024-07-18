import serialiseToXml from "../../../lib/serialise/ahoXml/serialiseToXml"
import type { ComparisonData } from "../../types/ComparisonData"
import { checkIntentionalDifferenceForPhases } from "./index"

// Core will remove a trailing space in the bail conditions

const trailingSpace = ({ expected, actual, phase }: ComparisonData) =>
  checkIntentionalDifferenceForPhases([1, 2], phase, (): boolean => {
    if (JSON.stringify(expected.courtResultMatchingSummary) !== JSON.stringify(actual.courtResultMatchingSummary)) {
      return false
    }

    const expectedXml = serialiseToXml(expected.aho)
    const actualXml = serialiseToXml(actual.aho)

    const expectedBailConditions =
      expected.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.BailConditions

    const bailConditionsHaveTrailingSpace = expectedBailConditions.some((bc) => /\s+$/.test(bc))

    return expectedXml === actualXml && bailConditionsHaveTrailingSpace
  })

export default trailingSpace
