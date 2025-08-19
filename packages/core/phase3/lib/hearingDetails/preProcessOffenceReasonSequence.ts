import type { Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

export const preProcessOffenceReasonSequence = (offence: Offence): string =>
  offence.CriminalProsecutionReference.OffenceReasonSequence?.padStart(3, "0") ?? ""
