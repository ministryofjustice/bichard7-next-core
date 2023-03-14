import type { Offence } from "../../../types/AnnotatedHearingOutcome"

const equalAsNumberOrString = (firstSeq: string | null, secondSeq: string | null): boolean =>
  String(firstSeq).replace(/^0+/, "") === String(secondSeq).replace(/^0+/, "") || Number(firstSeq) === Number(secondSeq)

const hasDuplicateSequenceNumber = (offence: Offence, allOffences: Offence[]): boolean => {
  const sequenceNumber = offence.CriminalProsecutionReference.OffenceReasonSequence
  const courtCaseRef = offence.CourtCaseReferenceNumber
  if (sequenceNumber !== undefined && offence.ManualSequenceNumber !== undefined) {
    return allOffences.some(
      (hoOffence) =>
        offence !== hoOffence &&
        (courtCaseRef === undefined || courtCaseRef === hoOffence.CourtCaseReferenceNumber) &&
        hoOffence.ManualSequenceNumber !== undefined &&
        hoOffence.CriminalProsecutionReference.OffenceReasonSequence &&
        equalAsNumberOrString(hoOffence.CriminalProsecutionReference.OffenceReasonSequence, sequenceNumber)
    )
  }
  return false
}

export default hasDuplicateSequenceNumber
