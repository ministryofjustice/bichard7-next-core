import type { Offence } from "../../types/AnnotatedHearingOutcome"

import isRecordableOffence from "./isRecordableOffence"

const getRecordableOffencesForCourtCase = (offences: Offence[], courtCaseReferenceNumber?: string) =>
  offences.filter(
    (offence) =>
      isRecordableOffence(offence) &&
      (!offence.CourtCaseReferenceNumber || offence.CourtCaseReferenceNumber === courtCaseReferenceNumber)
  )

export default getRecordableOffencesForCourtCase
