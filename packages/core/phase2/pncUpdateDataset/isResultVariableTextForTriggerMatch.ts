import type { TriggerCode } from "../../types/TriggerCode"
import getResultVariableTextForTriggerCode from "./getResultVariableTextForTriggerCode"

const isResultVariableTextForTriggerMatch = (triggerCode: TriggerCode, resultVariableText: string): boolean => {
  const regex = new RegExp(getResultVariableTextForTriggerCode(triggerCode))
  console.log(regex)

  const match = regex.exec(resultVariableText)

  console.table([match])

  if (match) {
    return true
  }

  return false
}

export default isResultVariableTextForTriggerMatch
