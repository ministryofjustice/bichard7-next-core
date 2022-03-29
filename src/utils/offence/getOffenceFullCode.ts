import type { Offence } from "src/types/AnnotatedHearingOutcome"

export default (offence: Offence): string | undefined => {
  const offenceReason =
    "OffenceReason" in offence.CriminalProsecutionReference
      ? offence.CriminalProsecutionReference.OffenceReason
      : undefined
  if (offenceReason) {
    return "OffenceCode" in offenceReason ? offenceReason.OffenceCode.FullCode : undefined
  }

  return undefined
}
