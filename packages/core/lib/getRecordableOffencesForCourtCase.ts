import isRecordableOffence from "../phase2/lib/isRecordableOffence"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"

const getRecordableOffencesForCourtCase = (aho: AnnotatedHearingOutcome, courtCaseReferenceNumber?: string) =>
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.filter(
    (offence) =>
      isRecordableOffence(offence) &&
      (!courtCaseReferenceNumber || offence.CourtCaseReferenceNumber === courtCaseReferenceNumber)
  )

export default getRecordableOffencesForCourtCase
