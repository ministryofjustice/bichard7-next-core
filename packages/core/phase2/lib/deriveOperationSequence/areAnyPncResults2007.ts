import type { AnnotatedHearingOutcome, Offence } from "../../../types/AnnotatedHearingOutcome"
import getCourtCaseFromQueryResults from "../../getCourtCaseFromQueryResults"

const areAnyPncResults2007 = (aho: AnnotatedHearingOutcome, offence: Offence): boolean => {
  const offenceReasonSequence = offence.CriminalProsecutionReference.OffenceReasonSequence
  const courtCaseReferenceNumber =
    offence.CourtCaseReferenceNumber || aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber
  if (!offenceReasonSequence || !aho.PncQuery || !courtCaseReferenceNumber) {
    return false
  }

  const matchingCase = getCourtCaseFromQueryResults(courtCaseReferenceNumber, aho.PncQuery)
  const hasAny2007PncResults = !!matchingCase?.offences?.some(
    (o) =>
      o.offence.sequenceNumber &&
      o.offence.sequenceNumber === Number(offenceReasonSequence) &&
      o.disposals?.some((disposal) => disposal.type === 2007)
  )

  return hasAny2007PncResults
}

export default areAnyPncResults2007
