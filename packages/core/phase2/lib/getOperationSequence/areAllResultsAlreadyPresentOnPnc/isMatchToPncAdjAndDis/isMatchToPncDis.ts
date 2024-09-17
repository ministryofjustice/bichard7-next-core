import type { Result } from "../../../../../types/AnnotatedHearingOutcome"
import type { ExceptionResult } from "../../../../../types/Exception"
import type { PncDisposal } from "../../../../../types/PncQueryResult"
import areDisposalsMatch from "./areDisposalsMatch"
import { createDisposalByResult } from "./createDisposalByResult"

const isMatchToPncDis = (
  pncDisposals: PncDisposal[],
  result: Result,
  offenceIndex: number,
  resultIndex: number
): ExceptionResult<boolean> => {
  const { value: ahoDisposals, exceptions } = createDisposalByResult(result, offenceIndex, resultIndex)
  const isMatch = ahoDisposals.every((ahoDisposal) =>
    pncDisposals.some((pncDisposal) => areDisposalsMatch(ahoDisposal, pncDisposal))
  )

  return { value: isMatch, exceptions }
}

export default isMatchToPncDis
