import type { OffenceCode } from "../types/OffenceCode"

export default (cjsCodeToMatch: string) => (oc: OffenceCode) => oc.cjsCode.trim() === cjsCodeToMatch.trim()
