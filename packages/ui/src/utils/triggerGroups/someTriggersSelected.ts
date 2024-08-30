import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { ReasonCode } from "types/CourtCaseFilter"
import selectedTrigger from "./selectedTrigger"

const someTriggersSelected = (allGroupTriggers: TriggerCode[], reasonCodes: ReasonCode[]): boolean => {
  const some = allGroupTriggers.filter((triggerCode) => selectedTrigger(triggerCode, reasonCodes))

  return some.length > 0 && some.length !== allGroupTriggers.length
}

export default someTriggersSelected
