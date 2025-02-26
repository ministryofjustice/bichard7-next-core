import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import type { TriggerGenerator } from "../../types/TriggerGenerator"

import Phase from "../../types/Phase"

const triggerCode = TriggerCode.TRPS0002
const phases: (Phase | undefined)[] = [Phase.PNC_UPDATE, Phase.PHASE_3]
const resultCodeForTrigger = 3107

const generator: TriggerGenerator = (hearingOutcome, options) => {
  if (!phases.includes(options?.phase)) {
    return []
  }

  const offences = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  const shouldGenerateTrigger = offences.some((offence) =>
    offence.Result.some((result) => result.CJSresultCode === resultCodeForTrigger)
  )
  return shouldGenerateTrigger ? [{ code: triggerCode }] : []
}

export default generator
