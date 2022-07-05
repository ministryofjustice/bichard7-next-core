import resultCodeIsFinal from "src/lib/result/resultCodeIsFinal"
import type { PncOffence } from "src/types/PncQueryResult"

const offenceHasFinalResult = (offence: PncOffence): boolean => {
  return !!offence.disposals?.some((disposal) => resultCodeIsFinal(disposal.type))
}

export default offenceHasFinalResult
