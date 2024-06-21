import serialiseToXml from "../../../phase1/serialise/ahoXml/serialiseToXml"
import type { ComparisonData } from "../../types/ComparisonData"
import { checkIntentionalDifferenceForPhases } from "./index"

// Core will remove a trailing space in the bail conditions

const trailingSpace = (comparisonData: ComparisonData) =>
  checkIntentionalDifferenceForPhases([1, 2], comparisonData, ({ expected, actual }: ComparisonData): boolean => {
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
