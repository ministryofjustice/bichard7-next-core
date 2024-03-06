import { excludedTriggerConfig as excludedTriggers } from "bichard7-next-data-latest"
import { TriggerCode } from "../../types/TriggerCode"

const excludedTriggerConfig = () => {
  if (process.env.NODE_ENV === "test" && "01" in excludedTriggers) {
    delete excludedTriggers["01"]
    excludedTriggers["42"] = [TriggerCode.TRPR0001]
    excludedTriggers["36"].push(TriggerCode.TRPR0004)
    excludedTriggers["36"].push(TriggerCode.TRPR0027)
  }
  return excludedTriggers
}

export default excludedTriggerConfig
