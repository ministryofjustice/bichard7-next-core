import type TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"

const resultVariableTextExceptions: Record<string, string> = {
  TRPS0001: "until further order,until (0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/(19|20)\\d\\d"
}

const getResultVariableTextNotForTriggerCode = (triggerCode: TriggerCode): string =>
  resultVariableTextExceptions[triggerCode] ?? ""

export default getResultVariableTextNotForTriggerCode
