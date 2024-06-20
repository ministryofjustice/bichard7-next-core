import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import isEqual from "lodash.isequal"
import type { TriggerGenerator } from "../../phase1/types/TriggerGenerator"
import { PncUpdateDataset } from "../../types/PncUpdateDataset"
import errorPaths from "../lib/errorPaths"
import { Trigger } from "../types/Trigger"

const triggerCode = TriggerCode.TRPS0003

const generator: TriggerGenerator = (hearingOutcome, options) => {
  if (options?.phase !== 2) {
    return []
  }

  const pncUpdateDataset = hearingOutcome as PncUpdateDataset
  const offences = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
  const triggers: Trigger[] = []

  for (let offenceIndex = -1; offenceIndex < offences.length; offenceIndex++) {
    const offence = offences[offenceIndex]

    const results = offence
      ? offence.Result
      : pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result
      ? [pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result]
      : undefined
    results?.forEach((_, resultIndex) => {
      const errorPath = errorPaths.offence(offenceIndex).result(resultIndex).resultVariableText
      const disposalTextError = pncUpdateDataset.Exceptions.find(
        (e) => e.code === "HO200200" && isEqual(e.path, errorPath)
      )
      if (disposalTextError) {
        triggers.push({ code: triggerCode, offenceSequenceNumber: offence.CourtOffenceSequenceNumber })
      }
    })
  }

  return triggers
}

export default generator
