import type { AnnotatedHearingOutcome, Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import findPncCourtCase from "../../lib/policeGateway/pnc/findPncCourtCase"

const areAnyPoliceDisposalsWithType = (
  aho: AnnotatedHearingOutcome,
  offence: Offence,
  disposalType: number
): boolean => {
  const matchingPoliceCourtCase = findPncCourtCase(aho, offence)

  return !!matchingPoliceCourtCase?.offences?.some(
    (o) =>
      o.offence.sequenceNumber &&
      o.offence.sequenceNumber === Number(offence.CriminalProsecutionReference.OffenceReasonSequence) &&
      o.disposals?.some((disposal) => disposal.type === disposalType)
  )
}

export default areAnyPoliceDisposalsWithType
