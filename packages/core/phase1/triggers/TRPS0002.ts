import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { TriggerGenerator } from "../../phase1/types/TriggerGenerator"
import { PncUpdateDataset } from "../../types/PncUpdateDataset"
import getOffenceCode from "../lib/offence/getOffenceCode"

const triggerCode = TriggerCode.TRPS0002
const offenceOrResultCodeForTrigger = "3107"

const generator: TriggerGenerator = (hearingOutcome, options) => {
  if (options?.phase !== 2) {
    return []
  }

  const pncUpdateDataset = hearingOutcome as PncUpdateDataset
  const offences = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  for (let offenceIndex = -1; offenceIndex < offences.length; offenceIndex++) {
    const offence = offences[offenceIndex]
    const offenceCode = offence ? getOffenceCode(offence) : undefined

    if (offenceCode === offenceOrResultCodeForTrigger) {
      return [{ code: triggerCode }]
    }

    const results = offence
      ? offence.Result
      : pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result
      ? [pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result]
      : undefined
    results?.forEach((result) => {
      if (result.CJSresultCode === Number(offenceOrResultCodeForTrigger)) {
        return [{ code: triggerCode }]
      }
    })
  }

  return []
}

export default generator
