import type { Offence } from "../../../types/AnnotatedHearingOutcome"

export const preProcessOffenceReasonSequence = (offence: Offence): string =>
  offence.CriminalProsecutionReference.OffenceReasonSequence?.padStart(3, "0") ?? ""
