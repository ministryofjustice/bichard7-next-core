import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import type { PncDisposal } from "../types/PncQueryResult"
import isPncDisposalMatch from "./isPncDisposalMatch"
import getDisFromResult from "./lib/getDisFromResult/getDisFromResult"

const isMatchToPncDis = (
  pncDisposals: PncDisposal[],
  aho: AnnotatedHearingOutcome,
  offenceIndex: number,
  resultIndex: number
): boolean =>
  getDisFromResult(aho, offenceIndex, resultIndex).every((ahoDis) =>
    pncDisposals.some((pncDis) => isPncDisposalMatch(ahoDis, pncDis))
  )

export default isMatchToPncDis
