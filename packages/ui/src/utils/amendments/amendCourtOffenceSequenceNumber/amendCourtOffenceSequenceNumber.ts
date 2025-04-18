import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import type { Amendments } from "types/Amendments"

const amendCourtOffenceSequenceNumber = (
  amendments: Amendments["courtOffenceSequenceNumber"],
  aho: AnnotatedHearingOutcome
) => {
  amendments?.forEach(({ offenceIndex, value }) => {
    if (!value) {
      return
    }

    const defendant = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
    const offenceIndexOutOfRange = offenceIndex > defendant.Offence.length - 1
    if (offenceIndexOutOfRange) {
      throw new Error("Cannot update the CourtOffenceSequenceNumber; Offence index is out of range")
    }

    defendant.Offence[offenceIndex].CourtOffenceSequenceNumber = value
    return
  })
}

export default amendCourtOffenceSequenceNumber
