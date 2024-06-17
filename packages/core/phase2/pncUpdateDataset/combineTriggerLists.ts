import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { Trigger } from "../../phase1/types/Trigger"

const combineTriggerLists = (preUpdateTriggersArray: Trigger[], postUpdateTriggersArray: Trigger[]): Trigger[] => {
  const combineTriggerList: Trigger[] = []
  let outOfAreaTriggerAdded = false
  preUpdateTriggersArray.forEach((preUpdateTrigger) => {
    combineTriggerList.push(preUpdateTrigger)
    if (preUpdateTrigger.code === TriggerCode.TRPR0027) {
      outOfAreaTriggerAdded = true
    }
  })

  postUpdateTriggersArray.forEach((postUpdateTrigger) => {
    if (postUpdateTrigger.code !== TriggerCode.TRPR0027 || !outOfAreaTriggerAdded) {
      combineTriggerList.push(postUpdateTrigger)
    }
  })

  return combineTriggerList
}

export default combineTriggerLists
