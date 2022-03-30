import type { Offence } from "src/types/AnnotatedHearingOutcome"
import { CjsPlea } from "src/types/Plea"
import { TriggerCode } from "src/types/TriggerCode"
import type { TriggerGenerator } from "src/types/TriggerGenerator"
import { CjsVerdict } from "src/types/Verdict"
import getOffenceFullCode from "src/utils/offence/getOffenceFullCode"

const triggerCode = TriggerCode.TRPR0008
const offenceCodes = ["BA76004", "BA76005"]

const isMatchingOffence = (offence: Offence) => {
  const fullCode = getOffenceFullCode(offence)
  return (
    fullCode &&
    offenceCodes.includes(fullCode) &&
    offence.Result.some((result) => result.Verdict === CjsVerdict.Guilty || result.PleaStatus === CjsPlea.Admits)
  )
}

const generator: TriggerGenerator = (hearingOutcome) => {
  if (hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.some(isMatchingOffence)) {
    return [{ code: triggerCode }]
  }
  return []
}

export default generator
