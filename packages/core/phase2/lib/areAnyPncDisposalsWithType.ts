import type { AnnotatedHearingOutcome, Offence } from "../../types/AnnotatedHearingOutcome"
import findPncCourtCase from "./findPncCourtCase"

const areAnyPncDisposalsWithType = (aho: AnnotatedHearingOutcome, offence: Offence, disposalType: number): boolean => {
  const matchingPncCourtCase = findPncCourtCase(aho, offence)

  return !!matchingPncCourtCase?.offences?.some(
    (o) =>
      o.offence.sequenceNumber &&
      o.offence.sequenceNumber === Number(offence.CriminalProsecutionReference.OffenceReasonSequence) &&
      o.disposals?.some((disposal) => disposal.type === disposalType)
  )
}

export default areAnyPncDisposalsWithType
