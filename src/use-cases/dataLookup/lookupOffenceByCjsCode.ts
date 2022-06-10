import { offenceCode } from "@moj-bichard7-developers/bichard7-next-data"

import type { OffenceCode } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { LookupResult } from "src/types/LookupResult"

export const lookupOffenceByCjsCode = (cjsCode: string): OffenceCode | undefined =>
  offenceCode.find((x) => x.cjsCode === cjsCode)

export const lookupNationalOffenceByCjsCode = (cjsCode: string, areaCode?: string): LookupResult => {
  const fullLookup = lookupOffenceByCjsCode(cjsCode)

  if (!fullLookup && cjsCode.length === 8) {
    const lookupNoQualifier = lookupOffenceByCjsCode(cjsCode.substring(0, 7))

    if (!lookupNoQualifier && areaCode) {
      const localLookup = lookupOffenceByCjsCode(`${areaCode}${cjsCode}`)
      return localLookup
        ? { result: localLookup }
        : {
            exception: {
              code: ExceptionCode.HO100306,
              subPath: ["CriminalProsecutionReference", "OffenceReason", "LocalOffenceCode", "OffenceCode"]
            }
          }
    }

    return lookupNoQualifier
      ? { result: lookupNoQualifier }
      : {
          exception: {
            code: ExceptionCode.HO100306,
            subPath: ["CriminalProsecutionReference", "OffenceReason", "OffenceCode"]
          }
        }
  }

  return fullLookup
    ? { result: fullLookup }
    : {
        exception: {
          code: ExceptionCode.HO100306,
          subPath: ["CriminalProsecutionReference", "OffenceReason", "OffenceCode"]
        }
      }
}

export const lookupLocalOffenceByCjsCode = (cjsCode: string, areaCode?: string): LookupResult => {
  const fullLookup = lookupOffenceByCjsCode(`${areaCode}${cjsCode}`)
  return fullLookup
    ? { result: fullLookup }
    : {
        exception: {
          code: ExceptionCode.HO100306,
          subPath: ["CriminalProsecutionReference", "OffenceReason", "LocalOffenceCode"]
        }
      }
}
