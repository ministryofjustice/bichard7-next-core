import type { AnnotatedHearingOutcome, Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import findPncCourtCase from "../../lib/policeGateway/pnc/findPncCourtCase"

const areAllPncDisposalsWithType = (aho: AnnotatedHearingOutcome, offence: Offence, disposalType: number) => {
  const matchingPncCourtCase = findPncCourtCase(aho, offence)
  const allDisposals = matchingPncCourtCase?.offences?.flatMap((offence) => offence.disposals ?? []) ?? []

  return allDisposals.length > 0 && allDisposals.every((disposal) => disposal.type === disposalType)
}

export default areAllPncDisposalsWithType
