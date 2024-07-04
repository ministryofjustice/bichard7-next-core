import type { Offence } from "../../types/AnnotatedHearingOutcome"

// prettier-ignore
const ignoredOffenceCategories = 
  ["B7", "EF", "EM", "EX", "FC", "FL", "FO", "FP", "FV", "LB", "LC", "LG", "LL", "LM", "VA", "VP"]

const isRecordableOffence = (offence: Offence): boolean =>
  !!offence.CriminalProsecutionReference?.OffenceReasonSequence ||
  !offence.OffenceCategory ||
  !ignoredOffenceCategories.includes(offence.OffenceCategory)

export default isRecordableOffence
