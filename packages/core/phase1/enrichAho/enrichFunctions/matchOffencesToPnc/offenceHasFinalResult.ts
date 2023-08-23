import resultCodeIsFinal from "phase1/lib/result/resultCodeIsFinal"
import type { PncOffence } from "types/PncQueryResult"

const offenceHasFinalResult = (offence: PncOffence): boolean => {
  return !!offence.disposals?.some((disposal) => resultCodeIsFinal(disposal.type))
}

export default offenceHasFinalResult
