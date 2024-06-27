import type TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import getResultVariableTextForTriggerCode from "./getResultVariableTextForTriggerCode"

const isResultVariableTextForTriggerMatch = (triggerCode: TriggerCode, resultVariableText: string): boolean =>
  !!new RegExp(getResultVariableTextForTriggerCode(triggerCode)).exec(resultVariableText)

export default isResultVariableTextForTriggerMatch
