import type { PncOffence } from "src/types/PncQueryResult"
import resultCodeIsFinal from "src/use-cases/resultCodeIsFinal"

const offenceHasFinalResult = (offence: PncOffence): boolean => {
  return !!offence.disposals?.some((disposal) => resultCodeIsFinal(disposal.type))
}

export default offenceHasFinalResult
