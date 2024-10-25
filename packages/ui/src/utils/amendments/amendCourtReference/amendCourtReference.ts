import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import type { Amendments } from "types/Amendments"

const amendCourtReference = (value: Amendments["courtReference"], aho: AnnotatedHearingOutcome) => {
  if (!value) {
    return
  }

  const courtReference = aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtReference
  if (!courtReference.MagistratesCourtReference && !courtReference.CrownCourtReference) {
    throw new Error("Cannot set CourtReference since unable to distinguish between Magistrates and Crown Court")
  }

  if (courtReference.MagistratesCourtReference) {
    courtReference.MagistratesCourtReference = value
  }
}

export default amendCourtReference
