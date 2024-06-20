import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { TriggerGenerator } from "../../phase1/types/TriggerGenerator"
import isResultVariableTextForTriggerMatch from "../../phase2/pncUpdateDataset/isResultVariableTextForTriggerMatch"
import isResultVariableTextNotForTriggerMatch from "../../phase2/pncUpdateDataset/isResultVariableTextNotForTriggerMatch"
import Phase from "../../types/Phase"
import type { Trigger } from "../types/Trigger"
import getResults from "./getResults"

const triggerCode = TriggerCode.TRPS0001
const restrainingOrderCJSResultCodes: number[] = []

const generator: TriggerGenerator = (hearingOutcome, options) => {
  if (options?.phase !== Phase.PNC_UPDATE) {
    return []
  }

  const triggers: Trigger[] = []
  const offences = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
  for (let offenceIndex = -1; offenceIndex < offences.length; offenceIndex++) {
    const offence = offenceIndex > -1 ? offences[offenceIndex] : undefined
    const results = getResults(hearingOutcome, offence)
    const shouldGenerateTrigger = results.some(
      (result) =>
        restrainingOrderCJSResultCodes.includes(result.CJSresultCode) &&
        result.ResultVariableText &&
        isResultVariableTextForTriggerMatch(triggerCode, result.ResultVariableText) &&
        !isResultVariableTextNotForTriggerMatch(triggerCode, result.ResultVariableText)
    )
    if (shouldGenerateTrigger) {
      triggers.push({ code: triggerCode, offenceSequenceNumber: offence?.CourtOffenceSequenceNumber })
    }
  }

  return triggers
}

export default generator
