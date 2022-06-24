import { excludedTriggerConfig } from "@moj-bichard7-developers/bichard7-next-data"
import { TriggerCode } from "src/types/TriggerCode"

if (process.env.NODE_ENV === "test" && "01" in excludedTriggerConfig) {
  delete excludedTriggerConfig["01"]
  excludedTriggerConfig["42"] = [TriggerCode.TRPR0001]
}

export default excludedTriggerConfig
