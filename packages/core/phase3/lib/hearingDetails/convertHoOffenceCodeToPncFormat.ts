import type { OffenceReason } from "../../../types/AnnotatedHearingOutcome"

export const convertHoOffenceCodeToPncFormat = (offCode?: OffenceReason): string => {
  if (!offCode) {
    return ""
  }

  if (offCode.__type !== "NationalOffenceReason") {
    return offCode.LocalOffenceCode.OffenceCode
  }

  const offenceReason: (string | undefined)[] = []
  if (offCode.OffenceCode.__type === "NonMatchingOffenceCode" && offCode.OffenceCode.ActOrSource) {
    offenceReason.push(offCode.OffenceCode.ActOrSource)
    offenceReason.push(offCode.OffenceCode.Year)
  } else if (offCode.OffenceCode.__type === "IndictmentOffenceCode" && offCode.OffenceCode.Indictment) {
    offenceReason.push(offCode.OffenceCode.Indictment)
  } else if (offCode.OffenceCode.__type === "CommonLawOffenceCode" && offCode.OffenceCode.CommonLawOffence) {
    offenceReason.push(offCode.OffenceCode.CommonLawOffence)
  }

  offenceReason.push(offCode.OffenceCode.Reason)
  offenceReason.push(offCode.OffenceCode.Qualifier)

  return offenceReason.join("")
}
