import { PncOffence, PncQueryResult } from "src/types/PncQueryResult"
import { Trigger } from "src/types/Trigger"
import { TriggerCode } from "src/types/TriggerCode"
import { TriggerGenerator } from "src/types/TriggerGenerator"

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
  return AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.reduce((acc: Trigger[], offence) => {
    const pncOffence = findMatchingPncOffence(
      PncQuery,
      AnnotatedHearingOutcome.HearingOutcome.Case.CourtReference.MagistratesCourtReference,
      offence.CourtOffenceSequenceNumber
    )
    if (!pncOffence) {
      return acc
    }
    const offenceStart = offence.ActualOffenceStartDate.StartDate
    const pncStart = pncOffence.offence.startDate
    if()
    acc.push({ code: triggerCode })
    return acc
  }, [])
}

export default generator
