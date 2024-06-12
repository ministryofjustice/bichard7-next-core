import type { TriggerCode } from "../../types/TriggerCode"

const resultVaraibleText = {
  TRPS0001: "Restraining order made that the defendant must",
  TRPS0002: "e",
  TRPR0004: "sex(ual)? off?ender,sex(ual)? off?en[cs]es act",
  TRPR0029: "granted"
} as Record<TriggerCode, string>

const getResultVariableTextForTriggerCode = (triggerCode: TriggerCode): string => {
  return resultVaraibleText[triggerCode] || ""
}

export default getResultVariableTextForTriggerCode
