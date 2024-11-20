import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import type { Trigger } from "../../types/Trigger"
import type { TriggerGenerator } from "../../types/TriggerGenerator"

import Phase from "../../types/Phase"

const triggerCode = TriggerCode.TRPS0008
const triggerResultCode = 3105

const generator: TriggerGenerator = (hearingOutcome, options) => {
  if (options?.phase !== Phase.PNC_UPDATE) {
    return []
  }

  const offences = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  return offences.reduce((triggers: Trigger[], offence) => {
    const shouldGenerateTrigger = offence.Result.some((result) => result.CJSresultCode === triggerResultCode)

    if (shouldGenerateTrigger) {
      triggers.push({ code: triggerCode, offenceSequenceNumber: offence.CourtOffenceSequenceNumber })
    }

    return triggers
  }, [])
}

export default generator
