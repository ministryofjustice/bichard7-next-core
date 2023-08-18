import type { Offence } from "core/common/types/AnnotatedHearingOutcome"

const nonRecordableOffenceCategories = [
  "B7",
  "EF",
  "EM",
  "EX",
  "FC",
  "FL",
  "FO",
  "FP",
  "FV",
  "LB",
  "LC",
  "LG",
  "LL",
  "LM",
  "VA",
  "VP"
]

const offenceCategoryIsNonRecordable = (offence: Offence): boolean =>
  !!offence.OffenceCategory && nonRecordableOffenceCategories.includes(offence.OffenceCategory)

export default offenceCategoryIsNonRecordable
