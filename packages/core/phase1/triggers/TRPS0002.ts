import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { TriggerGenerator } from "../../phase1/types/TriggerGenerator"
import Phase from "../../types/Phase"

const triggerCode = TriggerCode.TRPS0002
const resultCodeForTrigger = 3107

const generator: TriggerGenerator = (hearingOutcome, options) => {
  if (options?.phase !== Phase.PNC_UPDATE) {
    return []
  }

  const offences = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  const shouldGenerateTrigger = offences.some((offence) =>
    offence.Result.some((result) => result.CJSresultCode === resultCodeForTrigger)
  )
  return shouldGenerateTrigger ? [{ code: triggerCode }] : []
}

export default generator
