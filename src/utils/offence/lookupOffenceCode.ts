import { lookupLocalOffenceByCjsCode, lookupNationalOffenceByCjsCode } from "src/use-cases/dataLookup"
import type { OffenceReason } from "src/types/AnnotatedHearingOutcome"
import type { LookupResult } from "src/types/LookupResult"

export default (offenceCode: string, reason?: OffenceReason, areaCode?: string): LookupResult =>
  reason?.__type === "NationalOffenceReason"
    ? lookupNationalOffenceByCjsCode(offenceCode, areaCode)
    : lookupLocalOffenceByCjsCode(offenceCode, areaCode)
