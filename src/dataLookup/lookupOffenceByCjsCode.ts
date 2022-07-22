import type { OffenceCode } from "bichard7-next-data-latest/dist/types/types"
import requireStandingData from "src/lib/requireStandingData"
const { offenceCode } = requireStandingData()

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
