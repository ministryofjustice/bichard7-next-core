export const filterReasonCodesForExceptions = (reasonCodes: string[]): string[] =>
  reasonCodes.filter((rc) => rc.startsWith("HO"))

export const filterReasonCodesForTriggers = (reasonCodes: string[]): string[] =>
  reasonCodes.filter((rc) => !rc.startsWith("HO"))
