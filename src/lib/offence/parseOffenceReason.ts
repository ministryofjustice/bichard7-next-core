import { getLocalOffenceReason, getNationalOffenceReason } from "src/lib/offence/getOffenceReason"
import regexTestNationalOffenceCode from "src/lib/offence/regexTestNationalOffenceCode"
import type { OffenceReason } from "src/types/AnnotatedHearingOutcome"

// parse an offence code into an national offence reason or a local offence reason if the national reason isn't valid
export default (offenceCode: string, areaCode: string, reason?: OffenceReason): OffenceReason | undefined => {
  if (reason?.__type === "NationalOffenceReason") {
    const nationalOffenceReason = getNationalOffenceReason(offenceCode)
    if (nationalOffenceReason && "OffenceCode" in nationalOffenceReason) {
      return regexTestNationalOffenceCode(nationalOffenceReason.OffenceCode)
        ? nationalOffenceReason
        : getLocalOffenceReason(offenceCode, areaCode)
    }
  }

  if (reason?.__type === "LocalOffenceReason") {
    return getLocalOffenceReason(offenceCode, areaCode)
  }

  return undefined
}
