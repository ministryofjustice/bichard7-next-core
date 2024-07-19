import type { AnnotatedHearingOutcome } from "../../../../../types/AnnotatedHearingOutcome"
import type { ExceptionResult } from "../../../../../types/Exception"
import type { PncDisposal } from "../../../../../types/PncQueryResult"
import { getDisFromResult } from "./getDisFromResult"
import isPncDisposalMatch from "./isPncDisposalMatch"

const isMatchToPncDis = (
  pncDisposals: PncDisposal[],
  aho: AnnotatedHearingOutcome,
  offenceIndex: number,
  resultIndex: number
): ExceptionResult<boolean> => {
  const { value: disposals, exceptions } = getDisFromResult(aho, offenceIndex, resultIndex)
  const isMatch = disposals.every((ahoDis) => pncDisposals.some((pncDis) => isPncDisposalMatch(ahoDis, pncDis)))

  return { value: isMatch, exceptions }
}

export default isMatchToPncDis
