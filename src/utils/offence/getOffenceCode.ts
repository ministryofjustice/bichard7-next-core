import type { LocalOffenceCode, OffenceCode, OffenceReason } from "src/types/AnnotatedHearingOutcome"

const getOffenceCodeFromActOrSource = (offenceCode: OffenceCode): string =>
  offenceCode.__type === "NonMatchingOffenceCode" ? `${offenceCode.ActOrSource}${offenceCode.Year}` : ""

const getNationalOffenceCode = (offenceCode: OffenceCode): string => {
  const qualifier = offenceCode?.Qualifier ? offenceCode.Qualifier : ""
  if ("Indictment" in offenceCode) {
    return `${offenceCode.Indictment}${offenceCode.Reason}${qualifier}`
  }
  if ("CommonLawOffence" in offenceCode) {
    return `${offenceCode.CommonLawOffence}${offenceCode.Reason}${qualifier}`
  }
  return `${getOffenceCodeFromActOrSource(offenceCode)}${offenceCode.Reason}${qualifier}`
}

const getLocalOffenceCode = (localOffenceCode: LocalOffenceCode): string => `${localOffenceCode.OffenceCode}`

export default (offenceReason: OffenceReason) =>
  "OffenceCode" in offenceReason
    ? getNationalOffenceCode(offenceReason.OffenceCode)
    : getLocalOffenceCode(offenceReason.LocalOffenceCode)
