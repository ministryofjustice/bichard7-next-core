import type TriggerCode from "@moj-bichard7/standing-data/types/TriggerCode"
import type { ReasonCode } from "types/CourtCaseFilter"
import selectedTrigger from "./selectedTrigger"

const someTriggersSelected = (allGroupTriggers: TriggerCode[], reasonCodes: ReasonCode[]): boolean => {
  const some = allGroupTriggers.filter((triggerCode) => selectedTrigger(triggerCode, reasonCodes))

  return some.length > 0 && some.length !== allGroupTriggers.length
}

export default someTriggersSelected
