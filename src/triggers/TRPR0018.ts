import type { PncOffence, PncQueryResult } from "src/types/PncQueryResult"
import type { Trigger } from "src/types/Trigger"
import { TriggerCode } from "src/types/TriggerCode"
import type { TriggerGenerator } from "src/types/TriggerGenerator"

const triggerCode = TriggerCode.TRPR0018

const findMatchingPncOffence = (
  pncQuery: PncQueryResult,
  caseReference: string,
  sequenceNumber: number
): PncOffence | undefined =>
  pncQuery.cases
    .find((c) => c.courtCaseReference === caseReference)
    ?.offences.find((o) => o.offence.sequenceNumber === sequenceNumber)

const generator: TriggerGenerator = ({ AnnotatedHearingOutcome, PncQuery }, _) => {
  if (!PncQuery) {
    return []
  }
  return AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.reduce((triggers: Trigger[], offence) => {
    const pncOffence = findMatchingPncOffence(
      PncQuery,
      AnnotatedHearingOutcome.HearingOutcome.Case.CourtReference.MagistratesCourtReference,
      offence.CourtOffenceSequenceNumber
    )
    if (!pncOffence) {
      return triggers
    }
    const offenceStart = offence.ActualOffenceStartDate.StartDate
    const pncStart = pncOffence.offence.startDate

    const offenceEnd = offence.ActualOffenceEndDate.EndDate
    const pncEnd = pncOffence.offence.endDate

    if (!offenceEnd || !pncEnd) {
      return triggers
    }

    // Offence is fully contained by dates
    if (offenceStart >= pncStart && offenceEnd <= pncEnd) {
      triggers.push({ code: triggerCode, offenceSequenceNumber: offence.CourtOffenceSequenceNumber })
    }

    // triggers.push({ code: triggerCode })
    return triggers
  }, [])
}

export default generator
