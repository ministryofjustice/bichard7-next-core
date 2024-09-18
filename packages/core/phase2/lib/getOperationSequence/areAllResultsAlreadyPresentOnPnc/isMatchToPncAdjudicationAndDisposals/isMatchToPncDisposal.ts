import type { Result } from "../../../../../types/AnnotatedHearingOutcome"
import type { ExceptionResult } from "../../../../../types/Exception"
import type { PncDisposal } from "../../../../../types/PncQueryResult"
import arePncDisposalsMatching from "./arePncDisposalsMatching"
import { createPncDisposalFromResult } from "./createPncDisposalFromResult"

const isMatchToPncDisposal = (
  pncDisposals: PncDisposal[],
  result: Result,
  offenceIndex: number,
  resultIndex: number
): ExceptionResult<boolean> => {
  const { value: ahoDisposals, exceptions } = createPncDisposalFromResult(result, offenceIndex, resultIndex)
  const isMatch = ahoDisposals.every((ahoDisposal) =>
    pncDisposals.some((pncDisposal) => arePncDisposalsMatching(ahoDisposal, pncDisposal))
  )

  return { value: isMatch, exceptions }
}

export default isMatchToPncDisposal
