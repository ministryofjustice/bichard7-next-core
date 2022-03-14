import type { Offence } from "src/types/AnnotatedHearingOutcome"
import { CjsPlea } from "src/types/Plea"
import { TriggerCode } from "src/types/TriggerCode"
import type { TriggerGenerator } from "src/types/TriggerGenerator"
import { CjsVerdict } from "src/types/Verdict"

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
