import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { Offence } from "../../types/AnnotatedHearingOutcome"
import { CjsPlea } from "../../types/Plea"
import type { TriggerGenerator } from "../../types/TriggerGenerator"
import { CjsVerdict } from "../../types/Verdict"
import getOffenceFullCode from "../getOffenceFullCode"

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
