import type { Offence } from "../../types/AnnotatedHearingOutcome"
import type { PncOffence, PncQueryResult } from "../../types/PncQueryResult"
import { TriggerCode } from "../../types/TriggerCode"
import type { Trigger } from "../types/Trigger"
import type { TriggerGenerator } from "../types/TriggerGenerator"

const triggerCode = TriggerCode.TRPR0018

const findMatchingPncOffence = (
  pncQuery: PncQueryResult,
  caseReference: string | undefined,
  offence: Offence
): PncOffence | undefined => {
  let courtCaseReference = caseReference
  if (!courtCaseReference && offence.CourtCaseReferenceNumber) {
    courtCaseReference = offence.CourtCaseReferenceNumber
  }

  const sequenceNumber = Number(offence.CriminalProsecutionReference.OffenceReasonSequence)

  if (pncQuery.courtCases) {
    return pncQuery.courtCases
      .find((c) => c.courtCaseReference === courtCaseReference)
      ?.offences.find((o) => o.offence.sequenceNumber === sequenceNumber)
  }

  if (pncQuery.penaltyCases) {
    return pncQuery.penaltyCases
      .find((c) => c.penaltyCaseReference === courtCaseReference)
      ?.offences.find((o) => o.offence.sequenceNumber === sequenceNumber)
  }
}

const datesAreDifferent = (hoOffence: Offence, pncOffence: PncOffence): boolean => {
  const hoStartDate = hoOffence.ActualOffenceStartDate.StartDate
  const pncStartDate = pncOffence.offence.startDate
  const startDatesMatch = hoStartDate.getTime() === pncStartDate.getTime()

  if (!startDatesMatch) {
    return true
  }

  const hoEndDate = hoOffence.ActualOffenceEndDate?.EndDate
  const pncEndDate = pncOffence.offence.endDate
  const endDatesMatch = hoEndDate?.getTime() === pncEndDate?.getTime()

  if (endDatesMatch) {
    return false
  }

  if (!hoEndDate) {
    return hoStartDate.getTime() !== pncEndDate?.getTime()
  }

  if (!pncEndDate) {
    return hoEndDate?.getTime() !== pncStartDate.getTime()
  }

  return true
}

const generator: TriggerGenerator = ({ AnnotatedHearingOutcome, PncQuery }, _) => {
  if (!PncQuery) {
    return []
  }

  return AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.reduce((triggers: Trigger[], offence) => {
    const ahoCase = AnnotatedHearingOutcome.HearingOutcome.Case
    if (!offence.CriminalProsecutionReference.OffenceReasonSequence) {
      return triggers
    }

    const pncOffence = findMatchingPncOffence(
      PncQuery,
      ahoCase.CourtCaseReferenceNumber || ahoCase.PenaltyNoticeCaseReferenceNumber,
      offence
    )
    if (!pncOffence) {
      return triggers
    }

    if (datesAreDifferent(offence, pncOffence)) {
      triggers.push({ code: triggerCode, offenceSequenceNumber: offence.CourtOffenceSequenceNumber })
    }

    return triggers
  }, [])
}

export default generator
