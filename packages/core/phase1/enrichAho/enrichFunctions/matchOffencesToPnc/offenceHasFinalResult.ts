import type { PncOffence } from "@moj-bichard7/common/types/PncQueryResult"

import resultCodeIsFinal from "../../../../lib/results/resultCodeIsFinal"

const offenceHasFinalResult = (offence: PncOffence): boolean => {
  return !!offence.disposals?.some((disposal) => disposal.type && resultCodeIsFinal(disposal.type))
}

export default offenceHasFinalResult
