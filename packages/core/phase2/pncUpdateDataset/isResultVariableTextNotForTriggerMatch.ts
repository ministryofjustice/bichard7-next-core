import type TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import getResultVariableTextNotForTriggerCode from "./getResultVariableTextNotForTriggerCode"

const isResultVariableTextNotForTriggerMatch = (triggerCode: TriggerCode, resultVariableText: string): boolean => {
  const regex = new RegExp(getResultVariableTextNotForTriggerCode(triggerCode))

  const match = regex.exec(resultVariableText)

  if (match) {
    return true
  }

  return false
}

export default isResultVariableTextNotForTriggerMatch
