import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { TriggerGenerator } from "../../phase1/types/TriggerGenerator"
import isResultVariableTextForTriggerMatch from "../../phase2/pncUpdateDataset/isResultVariableTextForTriggerMatch"
import isResultVariableTextNotForTriggerMatch from "../../phase2/pncUpdateDataset/isResultVariableTextNotForTriggerMatch"

const triggerCode = TriggerCode.TRPS0001
const restrainingOrderCJSResultCodes: number[] = []

const generator: TriggerGenerator = (hearingOutcome, options) => {
  if (options?.phase !== 2) {
    return []
  }

  const offences = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
  for (let offenceIndex = -1; offenceIndex < offences.length; offenceIndex++) {
    const offence = offences[offenceIndex]

    const results = offence
      ? offence.Result
      : hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result
      ? [hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result]
      : undefined
    results?.forEach((result) => {
      if (restrainingOrderCJSResultCodes.includes(result.CJSresultCode)) {
        if (
          result.ResultVariableText &&
          isResultVariableTextForTriggerMatch(triggerCode, result.ResultVariableText) &&
          !isResultVariableTextNotForTriggerMatch(triggerCode, result.ResultVariableText)
        ) {
          return [{ code: triggerCode, offenceSequenceNumber: offence.CourtOffenceSequenceNumber }]
        }
      }
    })
  }

  return []
}

export default generator
