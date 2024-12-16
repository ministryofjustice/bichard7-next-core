import type { OffenceReason } from "../../../types/AnnotatedHearingOutcome"

export const convertHoOffenceCodeToPncFormat = (offenceReason?: OffenceReason): string => {
  if (!offenceReason) {
    return ""
  }

  if (offenceReason.__type == "LocalOffenceReason") {
    return offenceReason.LocalOffenceCode.OffenceCode
  }

  return offenceReason.OffenceCode.FullCode
}
