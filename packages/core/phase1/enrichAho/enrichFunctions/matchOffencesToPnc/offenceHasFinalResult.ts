import resultCodeIsFinal from "../../../../lib/resultCodeIsFinal"
import type { PncOffence } from "../../../../types/PncQueryResult"

const offenceHasFinalResult = (offence: PncOffence): boolean => {
  return !!offence.disposals?.some((disposal) => disposal.type && resultCodeIsFinal(disposal.type))
}

export default offenceHasFinalResult
