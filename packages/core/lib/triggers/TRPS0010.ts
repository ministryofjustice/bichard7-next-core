import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import disarrCompatibleResultClass from "../../phase2/lib/generateOperations/disarrCompatibleResultClass"
import isRecordableOffence from "../../phase2/lib/isRecordableOffence"
import Phase from "../../types/Phase"
import { isPncUpdateDataset } from "../../types/PncUpdateDataset"
import type { TriggerGenerator } from "../../types/TriggerGenerator"
import hasCompletedDisarr from "./hasCompletedDisarr"

const triggerCode = TriggerCode.TRPS0010

const generator: TriggerGenerator = (hearingOutcome, options) => {
  if (options?.phase !== Phase.PNC_UPDATE || !isPncUpdateDataset(hearingOutcome)) {
    return []
  }

  const offences = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  const triggers = offences
    .filter(
      (offence) =>
        offence.AddedByTheCourt &&
        isRecordableOffence(offence) &&
        hasCompletedDisarr(hearingOutcome, offence) &&
        disarrCompatibleResultClass(offence)
    )
    .map((offence) => ({ code: triggerCode, offenceSequenceNumber: offence.CourtOffenceSequenceNumber }))

  return triggers
}

export default generator
