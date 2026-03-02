import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

const NO_BAIL_CONDITIONS_TEXT = "No bail conditions found"

export const bailConditionsImposed = (aho: AnnotatedHearingOutcome): string => {
  const conditions = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.BailConditions

  if (!conditions || conditions.length === 0) {
    return NO_BAIL_CONDITIONS_TEXT
  }

  return conditions.join("\n")
}
