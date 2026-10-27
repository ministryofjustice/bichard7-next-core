import { excludedTriggerConfig as excludedTriggers } from "@moj-bichard7-developers/bichard7-next-data"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

const excludedTriggerConfig = () => {
  if (process.env.NODE_ENV === "test" && "01" in excludedTriggers) {
    excludedTriggers["01"] = [TriggerCode.TRPR0031]
    excludedTriggers["42"] = [TriggerCode.TRPR0001]
    excludedTriggers["36"].push(TriggerCode.TRPR0004)
    excludedTriggers["36"].push(TriggerCode.TRPR0027)

    // exclude trigger 31 for all forces in tests, other than force 54 which is used to test tr31
    Object.keys(excludedTriggers).forEach((forceCode) => {
      if (forceCode !== "54") {
        if (!excludedTriggers[forceCode].includes(TriggerCode.TRPR0031)) {
          excludedTriggers[forceCode].push(TriggerCode.TRPR0031)
        }
      }
    })

    delete excludedTriggers["54"]
  }

  return excludedTriggers
}

export default excludedTriggerConfig
