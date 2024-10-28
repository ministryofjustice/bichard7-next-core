import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import type { Amendments } from "types/Amendments"

const amendCourtCaseReference = (
  updatedOffenceValue: Amendments["courtCaseReference"],
  aho: AnnotatedHearingOutcome
) => {
  updatedOffenceValue?.forEach(({ offenceIndex, value }) => {
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].CourtCaseReferenceNumber =
      value?.length ? value : null

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].ManualCourtCaseReference =
      !!value?.length
  })
}

export default amendCourtCaseReference
