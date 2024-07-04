import type { AnnotatedHearingOutcome } from "../../../../../types/AnnotatedHearingOutcome"
import type { PncDisposal } from "../../../../../types/PncQueryResult"
import { getDisFromResult } from "./getDisFromResult"
import isPncDisposalMatch from "./isPncDisposalMatch"

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
