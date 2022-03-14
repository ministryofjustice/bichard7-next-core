import type { Offence } from "../types/AnnotatedHearingOutcome"
import { CjsPlea } from "../types/Plea"
import { TriggerCode } from "../types/TriggerCode"
import type { TriggerGenerator } from "../types/TriggerGenerator"
import { CjsVerdict } from "../types/Verdict"

const triggerCode = TriggerCode.TRPR0008
const offenceCodes = ["BA76004", "BA76005"]

const isMatchingOffence = (offence: Offence) =>
  offenceCodes.includes(offence.CriminalProsecutionReference.OffenceReason.OffenceCode.FullCode) &&
  offence.Result.some((result) => result.Verdict === CjsVerdict.Guilty || result.PleaStatus === CjsPlea.Admits)

const generator: TriggerGenerator = {
  independent: true,
  generate: (hearingOutcome, _) => {
    if (hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.some(isMatchingOffence)) {
      return [{ code: triggerCode }]
    }
    return []
  }
}

export default generator
