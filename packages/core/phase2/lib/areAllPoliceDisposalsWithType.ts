import type { AnnotatedHearingOutcome, Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import findPncCourtCase from "../../lib/policeGateway/pnc/findPncCourtCase"

const areAllPoliceDisposalsWithType = (aho: AnnotatedHearingOutcome, offence: Offence, disposalType: number) => {
  const matchingPoliceCourtCase = findPncCourtCase(aho, offence)
  const allDisposals = matchingPoliceCourtCase?.offences?.flatMap((offence) => offence.disposals ?? []) ?? []

  return allDisposals.length > 0 && allDisposals.every((disposal) => disposal.type === disposalType)
}

export default areAllPoliceDisposalsWithType
