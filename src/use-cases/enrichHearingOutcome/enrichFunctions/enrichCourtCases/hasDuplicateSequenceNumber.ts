import type { Offence } from "src/types/AnnotatedHearingOutcome"

const hasDuplicateSequenceNumber = (offence: Offence, allOffences: Offence[]): boolean => {
  const sequenceNumber = offence.CriminalProsecutionReference.OffenceReasonSequence
  const courtCaseRef = offence.CourtCaseReferenceNumber
  if (sequenceNumber !== undefined && offence.ManualSequenceNumber !== undefined) {
    return allOffences.some(
      (hoOffence) =>
        offence !== hoOffence &&
        (courtCaseRef === undefined || courtCaseRef === hoOffence.CourtCaseReferenceNumber) &&
        hoOffence.ManualSequenceNumber !== undefined &&
        offence.CriminalProsecutionReference.OffenceReasonSequence === sequenceNumber
    )
  }
  return false
}

export default hasDuplicateSequenceNumber
