import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { TriggerGenerator } from "../../phase1/types/TriggerGenerator"
import Phase from "../../types/Phase"
import getOffenceCode from "../lib/offence/getOffenceCode"
import getResults from "./getResults"

const triggerCode = TriggerCode.TRPS0002
const offenceOrResultCodeForTrigger = "3107"

const generator: TriggerGenerator = (hearingOutcome, options) => {
  if (options?.phase !== Phase.PNC_UPDATE) {
    return []
  }

  const offences = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  for (let offenceIndex = -1; offenceIndex < offences.length; offenceIndex++) {
    const offence = offenceIndex > -1 ? offences[offenceIndex] : undefined
    const offenceCode = offence ? getOffenceCode(offence) : undefined
    if (offenceCode === offenceOrResultCodeForTrigger) {
      return [{ code: triggerCode }]
    }

    const results = getResults(hearingOutcome, offence)
    if (results.some((result) => result.CJSresultCode === Number(offenceOrResultCodeForTrigger))) {
      return [{ code: triggerCode }]
    }
  }

  return []
}

export default generator
