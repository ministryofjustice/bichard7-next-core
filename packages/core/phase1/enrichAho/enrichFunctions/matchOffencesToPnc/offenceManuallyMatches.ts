import type { Offence } from "../../../../types/AnnotatedHearingOutcome"
import type { PncOffenceWithCaseRef } from "./matchOffencesToPnc"
import { normaliseCCR } from "./normaliseCCR"

export const offenceManuallyMatches = (hoOffence: Offence, pncOffence: PncOffenceWithCaseRef): boolean => {
  const manualSequence = !!hoOffence.ManualSequenceNumber
  const manualCourtCase = !!hoOffence.ManualCourtCaseReference
  const offenceReasonSequence = hoOffence.CriminalProsecutionReference.OffenceReasonSequence
  const sequence = Number(offenceReasonSequence)
  const courtCase = hoOffence.CourtCaseReferenceNumber
  if (manualSequence && isNaN(sequence)) {
    return false
  }

  const sequenceMatches = sequence === pncOffence.pncOffence.offence.sequenceNumber
  const ccrMatches = !!courtCase && normaliseCCR(courtCase) === normaliseCCR(pncOffence.caseReference)

  if (manualSequence && manualCourtCase) {
    return sequenceMatches && ccrMatches
  } else if (manualSequence) {
    return sequenceMatches
  } else if (manualCourtCase) {
    return ccrMatches
  }

  return false
}
