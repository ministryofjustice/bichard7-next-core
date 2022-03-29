import type { OffenceReason } from "src/types/AnnotatedHearingOutcome"
import { OffenceCodeType } from "src/utils/offence/consts"
import validateOffenceCode from "src/utils/offence/validateOffenceCode"
import { getNationalOffenceReason, getLocalOffenceReason } from "src/utils/offence/getOffenceReason"
import regexTestNationalOffenceCode from "src/utils/offence/regexTestNationalOffenceCode"

// parse a offence code into an national offence reason or a local offence reason if the national reason isn't valid
export default (offenceCode: string, areaCode: string): OffenceReason | undefined => {
  const result = validateOffenceCode(offenceCode, areaCode)
  if (result === OffenceCodeType.NATIONAL_CODE) {
    const nationalOffenceReason = getNationalOffenceReason(offenceCode)
    if (nationalOffenceReason && "OffenceCode" in nationalOffenceReason) {
      return regexTestNationalOffenceCode(nationalOffenceReason.OffenceCode)
        ? nationalOffenceReason
        : getLocalOffenceReason(offenceCode, areaCode)
    }
  }

  if (result === OffenceCodeType.LOCAL_CODE) {
    return getLocalOffenceReason(offenceCode, areaCode)
  }

  return undefined
}
