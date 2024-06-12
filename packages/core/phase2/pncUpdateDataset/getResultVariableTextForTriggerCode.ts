import type { TriggerCode } from "../../types/TriggerCode"

const resultVaraibleText: Record<string, string> = {
  TRPS0001: "Restraining order made that the defendant must",
  TRPS0002: "e",
  TRPR0004: "sex(ual)? off?ender,sex(ual)? off?en[cs]es act",
  TRPR0029: "granted"
}

const getResultVariableTextForTriggerCode = (triggerCode: TriggerCode): string => {
  if (Object.keys(resultVaraibleText).includes(triggerCode)) {
    return resultVaraibleText[triggerCode]
  }

  return ""
}

export default getResultVariableTextForTriggerCode
