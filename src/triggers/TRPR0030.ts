import type { Offence } from "src/types/AnnotatedHearingOutcome"
import { TriggerCode } from "src/types/TriggerCode"
import type { TriggerGenerator } from "src/types/TriggerGenerator"

const triggerCode = TriggerCode.TRPR0030
const offenceCodes = ["PL84504", "PL84505", "PL84506"]

const isMatchingOffence = (offence: Offence) =>
  offenceCodes.includes(offence.CriminalProsecutionReference.OffenceReason.OffenceCode.FullCode)

const generator: TriggerGenerator = (hearingOutcome, recordable) => {
  if (
    !recordable &&
    hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.some(isMatchingOffence)
  ) {
    return [{ code: triggerCode }]
  }
  return []
}

export default generator
