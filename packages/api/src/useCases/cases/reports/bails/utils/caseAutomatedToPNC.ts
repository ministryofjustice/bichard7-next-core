import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

export const caseAutomatedToPNC = (aho: AnnotatedHearingOutcome, errorCount: number): string => {
  const recordable = aho.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator

  if (errorCount >= 1) {
    return "No"
  }

  if (recordable) {
    return "Yes"
  } else {
    return "n/a"
  }
}
