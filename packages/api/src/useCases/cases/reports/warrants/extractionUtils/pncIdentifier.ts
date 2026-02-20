import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

export const pncIdentifier = (aho: AnnotatedHearingOutcome): string => {
  const defendant = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant

  return defendant.PNCIdentifier ?? defendant.CourtPNCIdentifier ?? " "
}
