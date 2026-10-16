import type { Amendments } from "@moj-bichard7/common/types/Amendments"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

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
