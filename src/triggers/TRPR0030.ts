import isCaseRecordable from "src/lib/isCaseRecordable"
import type { Offence } from "../types/AnnotatedHearingOutcome"
import { TriggerCode } from "../types/TriggerCode"
import type { TriggerGenerator } from "../types/TriggerGenerator"

const triggerCode = TriggerCode.TRPR0030
const offenceCodes = ["PL84504", "PL84505", "PL84506"]

const isMatchingOffence = (offence: Offence) =>
  offenceCodes.includes(offence.CriminalProsecutionReference.OffenceReason.OffenceCode.FullCode)

const generator: TriggerGenerator = (hearingOutcome) => {
  const recordable = isCaseRecordable(hearingOutcome)
  if (
    !recordable &&
    hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.some(isMatchingOffence)
  ) {
    return [{ code: triggerCode }]
  }
  return []
}

export default generator
