import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { TriggerGenerator } from "../../phase1/types/TriggerGenerator"
import Phase from "../../types/Phase"
import getOffenceCode from "../lib/offence/getOffenceCode"
import getResults from "./getResults"

const triggerCode = TriggerCode.TRPS0008
const triggerResultCode = 3105

const generator: TriggerGenerator = (hearingOutcome, options) => {
  if (options?.phase !== Phase.PNC_UPDATE) {
    return []
  }

  const offences = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
  for (const offence of offences) {
    const offenceCode = offence ? getOffenceCode(offence) : undefined
    const results = getResults(hearingOutcome, offence)
    for (const result of results) {
      if (result.CJSresultCode === triggerResultCode || offenceCode === triggerResultCode.toString()) {
        return [{ code: triggerCode, offenceSequenceNumber: offence.CourtOffenceSequenceNumber }]
      }
    }
  }

  return []
}

export default generator
