import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import type { TriggerGenerator } from "../../types/TriggerGenerator"

import isRecordableOffence from "../../phase2/lib/isRecordableOffence"
import isResultCompatibleWithDisposal from "../../phase2/lib/isResultCompatibleWithDisposal"
import Phase from "../../types/Phase"
import { isPncUpdateDataset } from "../../types/PncUpdateDataset"
import hasCompletedDisposal from "./hasCompletedDisposal"

const triggerCode = TriggerCode.TRPS0011
const phases: (Phase | undefined)[] = [Phase.PNC_UPDATE, Phase.PHASE_3]

const generator: TriggerGenerator = (hearingOutcome, options) => {
  if (!phases.includes(options?.phase) || !isPncUpdateDataset(hearingOutcome)) {
    return []
  }

  const offences = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  const triggers = offences
    .filter(
      (offence) =>
        offence.AddedByTheCourt &&
        isRecordableOffence(offence) &&
        (!hasCompletedDisposal(hearingOutcome, offence) || !isResultCompatibleWithDisposal(offence))
    )
    .map((offence) => ({ code: triggerCode, offenceSequenceNumber: offence.CourtOffenceSequenceNumber }))

  return triggers
}

export default generator
