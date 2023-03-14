import { TriggerCode } from "../types/TriggerCode"
import requireStandingData from "./requireStandingData"
const { excludedTriggerConfig } = requireStandingData()

if (process.env.NODE_ENV === "test" && "01" in excludedTriggerConfig) {
  delete excludedTriggerConfig["01"]
  excludedTriggerConfig["42"] = [TriggerCode.TRPR0001]
  excludedTriggerConfig["36"].push(TriggerCode.TRPR0004)
  excludedTriggerConfig["36"].push(TriggerCode.TRPR0027)
}

export default excludedTriggerConfig
