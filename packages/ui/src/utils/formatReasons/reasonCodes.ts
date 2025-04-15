import {
  filterReasonCodesForExceptions,
  filterReasonCodesForTriggers
} from "@moj-bichard7/common/utils/filterReasonCodes"
import { isEmpty } from "lodash"
import getLongTriggerCode from "services/entities/transformers/getLongTriggerCode"

export enum ReasonCodeTitle {
  Exceptions = "Exceptions",
  Triggers = "Triggers"
}

export type ReasonCodes = Record<ReasonCodeTitle, string[]>

const validateReasonCodes = (reasonCodes: string | string[]): string[] => {
  let reasonCodesArray: string[] = []

  if (Array.isArray(reasonCodes)) {
    reasonCodesArray = reasonCodes.map((reasonCode) => getLongTriggerCode(reasonCode) ?? reasonCode)
  } else {
    reasonCodesArray = reasonCodes.split(" ").map((reasonCode) => getLongTriggerCode(reasonCode) ?? reasonCode)
  }

  return reasonCodesArray
}

export const formatReasonCodes = (reasonCodes?: string | string[]): ReasonCodes => {
  const formattedReasonCodes: ReasonCodes = { Exceptions: [], Triggers: [] }

  if (!reasonCodes || isEmpty(reasonCodes)) {
    return formattedReasonCodes
  }

  const reasonCodesArray = validateReasonCodes(reasonCodes)

  if (reasonCodesArray.length === 0) {
    return formattedReasonCodes
  }

  formattedReasonCodes.Exceptions = filterReasonCodesForExceptions(reasonCodesArray)
  formattedReasonCodes.Triggers = filterReasonCodesForTriggers(reasonCodesArray)

  return formattedReasonCodes
}
