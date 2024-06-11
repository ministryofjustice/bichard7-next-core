import type { TriggerCode } from "../../types/TriggerCode"
import getResultVariableTextForTriggerCode from "./getResultVariableTextForTriggerCode"

const isResultVariableTextForTriggerMatch = (triggerCode: TriggerCode, resultVariableText: string): boolean => {
  const triggerVaraibleTexts = getResultVariableTextForTriggerCode(triggerCode)

  return triggerVaraibleTexts.includes(resultVariableText)
}

export default isResultVariableTextForTriggerMatch
