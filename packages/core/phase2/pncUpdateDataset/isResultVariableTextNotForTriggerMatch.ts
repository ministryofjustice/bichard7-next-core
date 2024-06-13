import getResultVariableTextNotForTriggerCode from "./getResultVariableTextNotForTriggerCode"

const isResultVariableTextNotForTriggerMatch = (triggerCode: string, resultVariableText: string): boolean => {
  const regex = new RegExp(getResultVariableTextNotForTriggerCode(triggerCode))

  const match = regex.exec(resultVariableText)

  if (match) {
    return true
  }

  return false
}

export default isResultVariableTextNotForTriggerMatch
