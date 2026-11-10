import type { OffenceCode } from "../types/OffenceCode"

export const getMatchCjsCodeFunction = (cjsCodeToMatch: string) => (oc: OffenceCode) =>
  oc.cjsCode.trim() === cjsCodeToMatch.trim()
