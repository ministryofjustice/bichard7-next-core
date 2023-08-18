import type { PncOffence } from "@moj-bichard7/common/pnc/PncQueryResult"
import resultCodeIsFinal from "../../../lib/result/resultCodeIsFinal"

const offenceHasFinalResult = (offence: PncOffence): boolean => {
  return !!offence.disposals?.some((disposal) => resultCodeIsFinal(disposal.type))
}

export default offenceHasFinalResult
