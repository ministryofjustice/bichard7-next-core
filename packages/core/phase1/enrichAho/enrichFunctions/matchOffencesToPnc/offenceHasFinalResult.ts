import type { PncOffence } from "../../../../types/PncQueryResult"
import resultCodeIsFinal from "../../../lib/result/resultCodeIsFinal"

const offenceHasFinalResult = (offence: PncOffence): boolean => {
  return !!offence.disposals?.some((disposal) => disposal.type && resultCodeIsFinal(disposal.type))
}

export default offenceHasFinalResult
