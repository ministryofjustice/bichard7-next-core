import { lookupLocalOffenceByCjsCode, lookupNationalOffenceByCjsCode } from "src/use-cases/dataLookup"
import type { LookupNationalOffenceCodeError, LookupLocalOffenceCodeError } from "src/types/LookupOffenceCodeError"

import type { OffenceReason } from "src/types/AnnotatedHearingOutcome"
import type { OffenceCode } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"

export default (
  offenceCode: string,
  reason?: OffenceReason,
  areaCode?: string
): OffenceCode | LookupNationalOffenceCodeError | LookupLocalOffenceCodeError =>
  reason?.__type === "NationalOffenceReason"
    ? lookupNationalOffenceByCjsCode(offenceCode, areaCode)
    : lookupLocalOffenceByCjsCode(offenceCode, areaCode)
