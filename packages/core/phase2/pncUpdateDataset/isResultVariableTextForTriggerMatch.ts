import type TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import getResultVariableTextForTriggerCode from "./getResultVariableTextForTriggerCode"

const isResultVariableTextForTriggerMatch = (triggerCode: TriggerCode, resultVariableText: string): boolean => {
  const regex = new RegExp(getResultVariableTextForTriggerCode(triggerCode))

  const match = regex.exec(resultVariableText)

  if (match) {
    return true
  }

  return false
}

export default isResultVariableTextForTriggerMatch
