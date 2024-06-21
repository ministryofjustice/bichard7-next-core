import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { TriggerGenerator } from "../../phase1/types/TriggerGenerator"
import isRecordableOffence from "../../phase2/isRecordableOffence"
import type { Offence } from "../../types/AnnotatedHearingOutcome"
import Phase from "../../types/Phase"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import { isPncUpdateDataset } from "../../types/PncUpdateDataset"

const triggerCode = TriggerCode.TRPS0013

const hasCompletedDisarr = (pncUpdateDataset: PncUpdateDataset, offence: Offence) =>
  pncUpdateDataset.PncOperations.some(
    ({ code, status, data }) =>
      code === "DISARR" &&
      status === "Completed" &&
      (!data?.courtCaseReference || data.courtCaseReference === offence.CourtCaseReferenceNumber)
  )

const generator: TriggerGenerator = (hearingOutcome, options) => {
  if (options?.phase !== Phase.PNC_UPDATE || !isPncUpdateDataset(hearingOutcome)) {
    return []
  }

  const offences = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  const triggers = offences
    .filter(
      (offence) =>
        isRecordableOffence(offence) &&
        !hasCompletedDisarr(hearingOutcome, offence) &&
        offence.Result.some((result) => result.NumberOfOffencesTIC)
    )
    .map((offence) => ({ code: triggerCode, offenceSequenceNumber: offence.CourtOffenceSequenceNumber }))

  return triggers
}

export default generator
