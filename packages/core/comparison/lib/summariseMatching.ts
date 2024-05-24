import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import { ExceptionCode } from "../../types/ExceptionCode"
import getOffenceCode from "../../phase1/lib/offence/getOffenceCode"
import type { CourtResultMatchingSummary } from "../types/MatchingComparisonOutput"

export const matchingExceptions: ExceptionCode[] = [
  ExceptionCode.HO100203,
  ExceptionCode.HO100304,
  ExceptionCode.HO100310,
  ExceptionCode.HO100311,
  ExceptionCode.HO100312,
  ExceptionCode.HO100320,
  ExceptionCode.HO100228,
  ExceptionCode.HO100328,
  ExceptionCode.HO100329,
  ExceptionCode.HO100332,
  ExceptionCode.HO100333,
  ExceptionCode.HO100507
]

const hasMatch = (aho: AnnotatedHearingOutcome): boolean => {
  const hasCaseRef = !!aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber
  const hasPenaltyCaseRef = !!aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber
  const hasOffenceRef = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.some(
    (o) => !!o.CourtCaseReferenceNumber
  )
  return hasCaseRef || hasPenaltyCaseRef || hasOffenceRef
}

const parseOffenceReasonSequence = (input: string | null | undefined): number | undefined => {
  if (!input) {
    return undefined
  }

  return Number(input)
}

const summariseMatching = (
  aho: AnnotatedHearingOutcome,
  includeOffenceCode = false
): CourtResultMatchingSummary | null => {
  const matchingExceptionsGenerated = aho.Exceptions.filter((e) => matchingExceptions.includes(e.code))
  if (matchingExceptionsGenerated.length > 0) {
    return { exceptions: matchingExceptionsGenerated }
  }

  if (!hasMatch(aho)) {
    return null
  }

  const caseElem = aho.AnnotatedHearingOutcome.HearingOutcome.Case
  const caseReference = caseElem.CourtCaseReferenceNumber ?? caseElem.PenaltyNoticeCaseReferenceNumber
  return {
    ...(caseReference ? { caseReference } : {}),
    offences: aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.map((offence) => ({
      hoSequenceNumber: offence.CourtOffenceSequenceNumber,
      ...(includeOffenceCode ? { offenceCode: getOffenceCode(offence) } : {}),
      ...(offence.CourtCaseReferenceNumber ? { courtCaseReference: offence.CourtCaseReferenceNumber } : {}),
      addedByCourt: !!offence.AddedByTheCourt,
      pncSequenceNumber: parseOffenceReasonSequence(offence.CriminalProsecutionReference.OffenceReasonSequence)
    }))
  }
}

export default summariseMatching
