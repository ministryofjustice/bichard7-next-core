import type { AnnotatedHearingOutcome, Offence } from "../../types/AnnotatedHearingOutcome"
import findPncCourtCase from "./findPncCourtCase"

const areAllPncResults2007 = (aho: AnnotatedHearingOutcome, offence: Offence) => {
  const matchingPncCourtCase = findPncCourtCase(aho, offence)
  const allDisposals = matchingPncCourtCase?.offences?.flatMap((offence) => offence.disposals ?? []) ?? []

  return allDisposals.length > 0 && allDisposals.every((disposal) => disposal.type === 2007)
}

export default areAllPncResults2007
