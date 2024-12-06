import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import type { Trigger } from "../../types/Trigger"
import type { TriggerGenerator } from "../../types/TriggerGenerator"

import { maxDisposalTextLength } from "../../phase2/lib/createPncDisposalsFromResult/createPncDisposalByFirstAndSecondDurations"
import { getDisposalTextFromResult } from "../../phase2/lib/getDisposalTextFromResult"
import isRecordableOffence from "../../phase2/lib/isRecordableOffence"
import isRecordableResult from "../../phase2/lib/isRecordableResult"
import Phase from "../../types/Phase"

const triggerCode = TriggerCode.TRPS0003
const phases: (Phase | undefined)[] = [Phase.PNC_UPDATE]

const generator: TriggerGenerator = (hearingOutcome, options) => {
  const triggers: Trigger[] = []

  if (!phases.includes(options?.phase)) {
    return []
  }

  const offences = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
  for (const offence of offences) {
    if (!isRecordableOffence(offence)) {
      continue
    }

    for (const result of offence.Result) {
      if (!isRecordableResult(result)) {
        continue
      }

      const disposalText = getDisposalTextFromResult(result)

      if (disposalText.length > maxDisposalTextLength) {
        triggers.push({ code: triggerCode, offenceSequenceNumber: offence?.CourtOffenceSequenceNumber })
      }
    }
  }

  return triggers
}

export default generator
