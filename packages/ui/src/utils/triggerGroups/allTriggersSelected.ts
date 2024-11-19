import type TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import type { ReasonCode } from "types/CourtCaseFilter"

import getLongTriggerCode from "services/entities/transformers/getLongTriggerCode"

const allTriggersSelected = (allGroupTriggers: TriggerCode[], reasonCodes: ReasonCode[]): boolean => {
  const selected = reasonCodes.map((reasonCode) => getLongTriggerCode(reasonCode.value))

  if (allGroupTriggers.length === selected.length) {
    return true
  }

  return false
}

export default allTriggersSelected
