import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { Amendments } from "types/Amendments"

const amendOffenceCourtCaseReferenceNumber = (
  amendments: Amendments["offenceCourtCaseReferenceNumber"],
  aho: AnnotatedHearingOutcome
) => {
  amendments?.forEach(({ value, offenceIndex }) => {
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].CourtCaseReferenceNumber =
      value

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].ManualCourtCaseReference =
      true
  })
}

export default amendOffenceCourtCaseReferenceNumber
