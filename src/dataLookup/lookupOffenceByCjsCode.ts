import { offenceCode } from "@moj-bichard7-developers/bichard7-next-data"

import type { OffenceCode } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"

export const lookupOffenceByCjsCode = (cjsCode: string): OffenceCode | undefined =>
  offenceCode.find((x) => x.cjsCode === cjsCode)

export const lookupNationalOffenceByCjsCode = (cjsCode: string, areaCode?: string): OffenceCode | undefined => {
  let lookup = lookupOffenceByCjsCode(cjsCode)

  if (!lookup && cjsCode.length === 8) {
    lookup = lookupOffenceByCjsCode(cjsCode.substring(0, 7))
  }

  if (!lookup && areaCode) {
    lookup = lookupOffenceByCjsCode(`${areaCode}${cjsCode}`)
  }

  return lookup
}

export const lookupLocalOffenceByCjsCode = (cjsCode: string, areaCode?: string): OffenceCode | undefined =>
  lookupOffenceByCjsCode(`${areaCode}${cjsCode}`)
