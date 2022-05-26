import type { Offence } from "src/types/AnnotatedHearingOutcome"

export default (offence: Offence): string | undefined => {
  const reason = offence.CriminalProsecutionReference.OffenceReason
  return reason?.__type === "NationalOffenceReason" ? reason.OffenceCode.FullCode : reason?.LocalOffenceCode.OffenceCode
}
