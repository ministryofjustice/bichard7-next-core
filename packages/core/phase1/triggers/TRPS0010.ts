import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { TriggerGenerator } from "../../phase1/types/TriggerGenerator"
import disarrCompatibleResultClass from "../../phase2/lib/deriveOperationSequence/disarrCompatibleResultClass"
import { Offence } from "../../types/AnnotatedHearingOutcome"
import { isPncUpdateDataset, PncUpdateDataset } from "../../types/PncUpdateDataset"

const triggerCode = TriggerCode.TRPS0010

const hasCompletedDisarr = (pncUpdateDataset: PncUpdateDataset, offence: Offence) =>
  pncUpdateDataset.PncOperations.some(
    ({ code, status, data }) =>
      code === "DISARR" &&
      status === "Completed" &&
      (!data?.courtCaseReference || data.courtCaseReference === offence.CourtCaseReferenceNumber)
  )

const generator: TriggerGenerator = (hearingOutcome, options) => {
  if (options?.phase !== 2 || !isPncUpdateDataset(hearingOutcome)) {
    return []
  }

  const offences = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  const triggers = offences
    .filter(
      (offence) =>
        offence.AddedByTheCourt && hasCompletedDisarr(hearingOutcome, offence) && disarrCompatibleResultClass(offence)
    )
    .map((offence) => ({ code: triggerCode, offenceSequenceNumber: offence.CourtOffenceSequenceNumber }))

  return triggers
}

export default generator
