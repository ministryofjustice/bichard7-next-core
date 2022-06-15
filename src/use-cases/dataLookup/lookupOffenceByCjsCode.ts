import { offenceCode } from "@moj-bichard7-developers/bichard7-next-data"
import { LookupNationalOffenceCodeError, LookupLocalOffenceCodeError } from "src/types/LookupOffenceCodeError"

import type { OffenceCode } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"

export const lookupOffenceByCjsCode = (cjsCode: string): OffenceCode | undefined =>
  offenceCode.find((x) => x.cjsCode === cjsCode)

export const lookupNationalOffenceByCjsCode = (
  cjsCode: string,
  areaCode?: string
): OffenceCode | LookupNationalOffenceCodeError | LookupLocalOffenceCodeError => {
  const fullLookup = lookupOffenceByCjsCode(cjsCode)

  if (!fullLookup && cjsCode.length === 8) {
    const lookupNoQualifier = lookupOffenceByCjsCode(cjsCode.substring(0, 7))

    if (!lookupNoQualifier && areaCode) {
      const localLookup = lookupOffenceByCjsCode(`${areaCode}${cjsCode}`)
      return localLookup ? localLookup : new LookupLocalOffenceCodeError(`${areaCode}${cjsCode}`)
    }

    return lookupNoQualifier ? lookupNoQualifier : new LookupNationalOffenceCodeError(`${areaCode}${cjsCode}`)
  }

  return fullLookup ? fullLookup : new LookupNationalOffenceCodeError(`${areaCode}${cjsCode}`)
}

export const lookupLocalOffenceByCjsCode = (
  cjsCode: string,
  areaCode?: string
): OffenceCode | LookupLocalOffenceCodeError => {
  const fullLookup = lookupOffenceByCjsCode(`${areaCode}${cjsCode}`)
  return fullLookup ? fullLookup : new LookupLocalOffenceCodeError(`${areaCode}${cjsCode}`)
}
