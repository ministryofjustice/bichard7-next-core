import type { PoliceOffence } from "@moj-bichard7/common/types/PoliceQueryResult"

import resultCodeIsFinal from "../../../../lib/results/resultCodeIsFinal"

const offenceHasFinalResult = (offence: PoliceOffence): boolean => {
  return !!offence.disposals?.some((disposal) => disposal.type && resultCodeIsFinal(disposal.type))
}

export default offenceHasFinalResult
