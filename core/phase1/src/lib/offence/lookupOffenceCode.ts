import { lookupLocalOffenceByCjsCode, lookupNationalOffenceByCjsCode } from "../../dataLookup"

import type { OffenceCode } from "bichard7-next-data-latest/dist/types/types"
import type { OffenceCode as OffenceCodeLocal, OffenceReason } from "../../types/AnnotatedHearingOutcome"

const validQualifiers = ["A", "B", "C", "I"]

const isValidNonMatchingOffenceCode = (offenceCode: OffenceCodeLocal) =>
  offenceCode.__type === "NonMatchingOffenceCode" &&
  offenceCode.ActOrSource.match(/[A-Z]{2}/) &&
  offenceCode.Year?.match(/[0-9]{2}/) &&
  offenceCode.Reason.match(/[0-9]{3}/) &&
  (!offenceCode.Qualifier || validQualifiers.includes(offenceCode.Qualifier))

const isValidCommonLawOffenceCode = (offenceCode: OffenceCodeLocal) =>
  offenceCode.__type === "CommonLawOffenceCode" &&
  offenceCode.CommonLawOffence === "COML" &&
  offenceCode.Reason.match(/[0-9]{3}/) &&
  (!offenceCode.Qualifier || validQualifiers.includes(offenceCode.Qualifier))

const isValidIndictmentOffenceCode = (offenceCode: OffenceCodeLocal) =>
  offenceCode.__type === "IndictmentOffenceCode" &&
  offenceCode.Indictment === "XX00" &&
  offenceCode.Reason.match(/[0-9]{3}/) &&
  (!offenceCode.Qualifier || validQualifiers.includes(offenceCode.Qualifier))

const isValidReason = (reason?: OffenceReason) =>
  reason &&
  reason.__type === "NationalOffenceReason" &&
  (isValidNonMatchingOffenceCode(reason.OffenceCode) ||
    isValidCommonLawOffenceCode(reason.OffenceCode) ||
    isValidIndictmentOffenceCode(reason.OffenceCode))

export default (offenceCode: string, reason?: OffenceReason, areaCode?: string): OffenceCode | undefined =>
  reason?.__type === "NationalOffenceReason" && isValidReason(reason)
    ? lookupNationalOffenceByCjsCode(offenceCode, areaCode)
    : lookupLocalOffenceByCjsCode(offenceCode, areaCode)
