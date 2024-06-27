import type TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import getResultVariableTextNotForTriggerCode from "./getResultVariableTextNotForTriggerCode"

const isResultVariableTextNotForTriggerMatch = (triggerCode: TriggerCode, resultVariableText: string): boolean =>
  !!new RegExp(getResultVariableTextNotForTriggerCode(triggerCode)).exec(resultVariableText)

export default isResultVariableTextNotForTriggerMatch
