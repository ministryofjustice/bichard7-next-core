import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import type { Trigger } from "../../types/Trigger"
import type { TriggerGenerator } from "../../types/TriggerGenerator"

import Phase from "../../types/Phase"
import forEachRecordableResult from "../offences/forEachRecordableResult"
import { maxDisposalTextLength } from "../results/createPncDisposalsFromResult/createPncDisposalByFirstAndSecondDurations"
import { getDisposalTextFromResult } from "../results/getDisposalTextFromResult"

const triggerCode = TriggerCode.TRPS0003
const phases: (Phase | undefined)[] = [Phase.PNC_UPDATE, Phase.PHASE_3]

const generator: TriggerGenerator = (hearingOutcome, options) => {
  const triggers: Trigger[] = []

  if (!phases.includes(options?.phase)) {
    return []
  }

  forEachRecordableResult(hearingOutcome, (offence, _, result, __) => {
    const disposalText = getDisposalTextFromResult(result)

    if (disposalText.length > maxDisposalTextLength) {
      triggers.push({ code: triggerCode, offenceSequenceNumber: offence?.CourtOffenceSequenceNumber })
    }
  })

  return triggers
}

export default generator
