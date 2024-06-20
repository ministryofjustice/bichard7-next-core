import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import isEqual from "lodash.isequal"
import type { TriggerGenerator } from "../../phase1/types/TriggerGenerator"
import Phase from "../../types/Phase"
import errorPaths from "../lib/errorPaths"
import type { Trigger } from "../types/Trigger"

const triggerCode = TriggerCode.TRPS0003

const generator: TriggerGenerator = (hearingOutcome, options) => {
  if (options?.phase !== Phase.PNC_UPDATE) {
    return []
  }

  const offences = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
  const triggers: Trigger[] = []

  for (let offenceIndex = -1; offenceIndex < offences.length; offenceIndex++) {
    const offence = offenceIndex > -1 ? offences[offenceIndex] : undefined

    const results = offence
      ? offence.Result
      : hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result
      ? [hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result]
      : undefined
    results?.forEach((_, resultIndex) => {
      const errorPath = errorPaths.offence(offenceIndex).result(resultIndex).resultVariableText
      const disposalTextError = hearingOutcome.Exceptions.find(
        (e) => e.code === "HO200200" && isEqual(e.path, errorPath)
      )
      if (disposalTextError) {
        triggers.push({ code: triggerCode, offenceSequenceNumber: offence?.CourtOffenceSequenceNumber })
      }
    })
  }

  return triggers
}

export default generator
