import type { Amendments } from "@moj-bichard7/common/types/Amendments"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

const amendOffenceReasonSequence = (
  newOffenceReasonSequence: Amendments["offenceReasonSequence"],
  aho: AnnotatedHearingOutcome
) => {
  newOffenceReasonSequence?.forEach(({ offenceIndex, value }) => {
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
