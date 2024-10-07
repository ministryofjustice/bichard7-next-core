import type { Result } from "../../../../../types/AnnotatedHearingOutcome"
import type { PncDisposal } from "../../../../../types/PncQueryResult"
import arePncDisposalsMatching from "./arePncDisposalsMatching"
import { createPncDisposalFromResult } from "./createPncDisposalFromResult"

const isMatchToPncDisposal = (pncDisposals: PncDisposal[], result: Result): boolean =>
  createPncDisposalFromResult(result).every((ahoDisposal) =>
    pncDisposals.some((pncDisposal) => arePncDisposalsMatching(ahoDisposal, pncDisposal))
  )

export default isMatchToPncDisposal
