import type { Amendments } from "@moj-bichard7/common/types/Amendments"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

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
