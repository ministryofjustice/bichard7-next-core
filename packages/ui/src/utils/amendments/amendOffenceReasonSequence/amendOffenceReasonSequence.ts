import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import type { Amendments } from "types/Amendments"

const amendOffenceReasonSequence = (
  newOffenceReasonSequence: Amendments["offenceReasonSequence"],
  aho: AnnotatedHearingOutcome
) => {
  newOffenceReasonSequence?.forEach(({ value, offenceIndex }) => {
    if (value === undefined) {
      return
    }

    const offence = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex]
    if (value > 0) {
      offence.CriminalProsecutionReference.OffenceReasonSequence = String(value)
      offence.ManualSequenceNumber = true
      return
    }

    offence.AddedByTheCourt = true
  })
}

export default amendOffenceReasonSequence
