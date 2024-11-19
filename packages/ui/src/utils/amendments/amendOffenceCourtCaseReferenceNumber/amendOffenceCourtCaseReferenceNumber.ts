import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import type { Amendments } from "types/Amendments"

const amendOffenceCourtCaseReferenceNumber = (
  amendments: Amendments["offenceCourtCaseReferenceNumber"],
  aho: AnnotatedHearingOutcome
) => {
  amendments?.forEach(({ offenceIndex, value }) => {
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].CourtCaseReferenceNumber =
      value

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].ManualCourtCaseReference =
      true
  })
}

export default amendOffenceCourtCaseReferenceNumber
