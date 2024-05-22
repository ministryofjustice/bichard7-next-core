import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import type { PncDisposal } from "../types/PncQueryResult"
import isPncDisposalMatch from "./isPncDisposalMatch"
import getDisFromResult from "./lib/getDisFromResult/getDisFromResult"

const isMatchToPncDis = (
  pncDisposals: PncDisposal[],
  aho: AnnotatedHearingOutcome,
  offenceIndex: number,
  resultIndex: number
): boolean => {
  if (pncDisposals.length === 0) {
    return false
  }

  const ahoDisposals = getDisFromResult(aho, offenceIndex, resultIndex)

  return ahoDisposals.every((ahoDis) => pncDisposals.some((pncDis) => isPncDisposalMatch(ahoDis, pncDis)))
}

export default isMatchToPncDis
