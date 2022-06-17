import { excludedTriggerConfig } from "@moj-bichard7-developers/bichard7-next-data"

if (process.env.NODE_ENV === "test" && "01" in excludedTriggerConfig) {
  delete excludedTriggerConfig["01"]
}

export default excludedTriggerConfig
