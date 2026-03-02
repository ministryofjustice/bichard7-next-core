import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

export const hearingTime = (aho: AnnotatedHearingOutcome): string => {
  return aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.TimeOfHearing ?? ""
}
