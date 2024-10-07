import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import getLongTriggerCode from "services/entities/transformers/getLongTriggerCode"
import { ReasonCode } from "types/CourtCaseFilter"

const allTriggersSelected = (allGroupTriggers: TriggerCode[], reasonCodes: ReasonCode[]): boolean => {
  const selected = reasonCodes.map((reasonCode) => getLongTriggerCode(reasonCode.value))

  if (allGroupTriggers.length === selected.length) {
    return true
  }
  return false
}

export default allTriggersSelected
