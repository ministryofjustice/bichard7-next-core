import { CjsPlea } from "phase1/types/Plea"
import { CjsVerdict } from "phase1/types/Verdict"
import type { Offence } from "types/AnnotatedHearingOutcome"
import { TriggerCode } from "types/TriggerCode"
import getOffenceFullCode from "../lib/offence/getOffenceFullCode"
import type { TriggerGenerator } from "../types/TriggerGenerator"

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
