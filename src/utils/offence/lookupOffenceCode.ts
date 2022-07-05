import { lookupLocalOffenceByCjsCode, lookupNationalOffenceByCjsCode } from "src/dataLookup"
import type { LookupLocalOffenceCodeError, LookupNationalOffenceCodeError } from "src/types/LookupOffenceCodeError"

import type { OffenceCode } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import type { OffenceReason } from "src/types/AnnotatedHearingOutcome"

export default (
  offenceCode: string,
  reason?: OffenceReason,
  areaCode?: string
): OffenceCode | LookupNationalOffenceCodeError | LookupLocalOffenceCodeError =>
  reason?.__type === "NationalOffenceReason"
    ? lookupNationalOffenceByCjsCode(offenceCode, areaCode)
    : lookupLocalOffenceByCjsCode(offenceCode, areaCode)
