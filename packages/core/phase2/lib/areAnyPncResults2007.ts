import type { AnnotatedHearingOutcome, Offence } from "../../types/AnnotatedHearingOutcome"
import findPncCourtCase from "./findPncCourtCase"

const areAnyPncResults2007 = (aho: AnnotatedHearingOutcome, offence: Offence): boolean => {
  const matchingPncCourtCase = findPncCourtCase(aho, offence)

  return !!matchingPncCourtCase?.offences?.some(
    (o) =>
      o.offence.sequenceNumber &&
      o.offence.sequenceNumber === Number(offence.CriminalProsecutionReference.OffenceReasonSequence) &&
      o.disposals?.some((disposal) => disposal.type === 2007)
  )
}

export default areAnyPncResults2007
