import type { PncOffence, PncQueryResult } from "../types/PncQueryResult"
import type { Trigger } from "../types/Trigger"
import { TriggerCode } from "../types/TriggerCode"
import type { TriggerGenerator } from "../types/TriggerGenerator"

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
    const courtStart = offence.ActualOffenceStartDate.StartDate
    const pncStart = pncOffence.offence.startDate

    const courtEnd = offence.ActualOffenceEndDate.EndDate
    const pncEnd = pncOffence.offence.endDate

    if (!courtStart || !pncStart) {
      return triggers
    }
    if (!courtEnd && !pncEnd && courtStart.getTime() === pncStart.getTime()) {
      return triggers
    }
    if (
      (courtStart >= pncStart && !courtEnd && pncEnd) ||
      (courtEnd && pncEnd && (courtStart > pncStart || courtEnd < pncEnd))
    ) {
      triggers.push({ code: triggerCode, offenceSequenceNumber: offence.CourtOffenceSequenceNumber })
    }

    return triggers
  }, [])
}

export default generator
