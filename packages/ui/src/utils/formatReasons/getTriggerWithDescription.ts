import triggerDefinitions from "@moj-bichard7-developers/bichard7-next-data/dist/data/trigger-definitions.json"
import getShortTriggerCode from "../../services/entities/transformers/getShortTriggerCode"

const getTriggerWithDescription = (triggerCode: string, withShortTriggerCode?: boolean): string => {
  const shortTriggerCode = getShortTriggerCode(triggerCode)
  let triggerWithDescription = triggerCode

  if (withShortTriggerCode && shortTriggerCode) {
    triggerWithDescription = shortTriggerCode
  }

  triggerDefinitions.filter((record) => {
    if (record.code === triggerCode) {
      if (withShortTriggerCode) {
        triggerWithDescription = `${shortTriggerCode} - ${record.shortDescription}`
      } else {
        triggerWithDescription = `${triggerCode} - ${record.shortDescription}`
      }
    }
  })

  return triggerWithDescription
}

export default getTriggerWithDescription
