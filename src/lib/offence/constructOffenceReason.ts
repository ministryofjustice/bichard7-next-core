import { lookupOffenceByCjsCode } from "../../dataLookup"
import { getLocalOffenceReason, getNationalOffenceReason } from "../../lib/offence/getOffenceReason"
import regexTestNationalOffenceCode from "../../lib/offence/regexTestNationalOffenceCode"
import type { OffenceReason } from "../../types/AnnotatedHearingOutcome"

// parse an offence code into an national offence reason or a local offence reason if the national reason isn't valid
export default (offenceCode: string, areaCode: string, reason?: OffenceReason): OffenceReason | undefined => {
  if (reason?.__type === "NationalOffenceReason") {
    const nationalOffenceReason = getNationalOffenceReason(offenceCode)
    if (nationalOffenceReason && "OffenceCode" in nationalOffenceReason) {
      if (regexTestNationalOffenceCode(nationalOffenceReason.OffenceCode)) {
        let foundCode = lookupOffenceByCjsCode(offenceCode)
        if (!foundCode && offenceCode.length === 8) {
          foundCode = lookupOffenceByCjsCode(offenceCode.substring(0, 7))
        }
        if (!foundCode && areaCode) {
          foundCode = lookupOffenceByCjsCode(`${areaCode}${offenceCode}`)
          if (foundCode) {
            return getLocalOffenceReason(offenceCode, areaCode)
          }
        }
        return nationalOffenceReason
      } else {
        return getLocalOffenceReason(offenceCode, areaCode)
      }
    }
  }

  if (reason?.__type === "LocalOffenceReason") {
    return getLocalOffenceReason(offenceCode, areaCode)
  }

  return undefined
}
