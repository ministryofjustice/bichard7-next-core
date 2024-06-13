const resultVariableTextExceptions: Record<string, string> = {
  TRPS0001: "until further order,until (0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/(19|20)\\d\\d"
}

const getResultVariableTextNotForTriggerCode = (triggerCode: string): string => {
  if (Object.keys(resultVariableTextExceptions).includes(triggerCode)) {
    return resultVariableTextExceptions[triggerCode]
  }

  return ""
}

export default getResultVariableTextNotForTriggerCode
