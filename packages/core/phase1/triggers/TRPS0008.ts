import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { TriggerGenerator } from "../../phase1/types/TriggerGenerator"
import Phase from "../../types/Phase"
import getOffenceCode from "../lib/offence/getOffenceCode"
import type { Trigger } from "../types/Trigger"

const triggerCode = TriggerCode.TRPS0008
const offenceOrResultCodeForTrigger = "3105"

const generator: TriggerGenerator = (hearingOutcome, options) => {
  if (options?.phase !== Phase.PNC_UPDATE) {
    return []
  }

  const offences = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
  const triggers: Trigger[] = []

  for (let offenceIndex = -1; offenceIndex < offences.length; offenceIndex++) {
    const offence = offenceIndex > -1 ? offences[offenceIndex] : undefined
    const offenceCode = offence ? getOffenceCode(offence) : undefined

    if (offenceCode === offenceOrResultCodeForTrigger) {
      triggers.push({ code: triggerCode, offenceSequenceNumber: offence?.CourtOffenceSequenceNumber })
    }

    const results = offence
      ? offence.Result
      : hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result
      ? [hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result]
      : undefined
    results?.forEach((result) => {
      if (result.CJSresultCode === Number(offenceOrResultCodeForTrigger)) {
        triggers.push({ code: triggerCode, offenceSequenceNumber: offence?.CourtOffenceSequenceNumber })
      }
    })
  }

  return triggers
}

export default generator
