import triggerDefinitions from "@moj-bichard7/standing-data/data/trigger-definitions.json"

import getShortTriggerCode from "./getShortTriggerCode"

const getTriggerWithDescription = (triggerCode: string, withShortTriggerCode?: boolean): string => {
  const shortTriggerCode = getShortTriggerCode(triggerCode)
  let triggerWithDescription = triggerCode

  if (withShortTriggerCode && shortTriggerCode) {
    triggerWithDescription = shortTriggerCode
  }

  triggerDefinitions.forEach((record) => {
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
