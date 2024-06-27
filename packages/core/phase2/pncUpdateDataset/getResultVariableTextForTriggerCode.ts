import type TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"

const resultVariableText: Record<string, string> = {
  TRPS0001: "Restraining order made that the defendant must",
  TRPS0002: "e",
  TRPR0004: "sex(ual)? off?ender,sex(ual)? off?en[cs]es act",
  TRPR0029: "granted"
}

const getResultVariableTextForTriggerCode = (triggerCode: TriggerCode): string => resultVariableText[triggerCode] ?? ""

export default getResultVariableTextForTriggerCode
